import { useState } from "react";
import { create } from "ipfs-http-client";

// use Vite env (import.meta.env) — safe in browser
const USE_LOCAL = (import.meta.env.VITE_USE_LOCAL_IPFS ?? "false") === "true";
const INFURA_ID = import.meta.env.VITE_INFURA_PROJECT_ID as string | undefined;
const INFURA_SECRET = import.meta.env.VITE_INFURA_PROJECT_SECRET as
  | string
  | undefined;
const LOCAL_API = "http://127.0.0.1:5001/api/v0";
const LOCAL_GATEWAY_PORT = import.meta.env.VITE_IPFS_GATEWAY_PORT ?? "8081";
const LOCAL_GATEWAY = `http://127.0.0.1:${LOCAL_GATEWAY_PORT}/ipfs`;
const PUBLIC_GATEWAY = "https://ipfs.io/ipfs";

/**
 * Robust useIPFS hook:
 * - Prefer local daemon when NEXT_PUBLIC_USE_LOCAL_IPFS=true
 * - Use Infura when NEXT_PUBLIC_INFURA_PROJECT_ID/SECRET provided
 * - Fall back to public gateway for reads if no API client available
 * - Provide clear errors instead of silent mock hashes
 */

let apiClient: any | undefined = undefined;

// initialize client based on env/availability
const initClient = () => {
  if (apiClient) return apiClient;

  try {
    if (USE_LOCAL) {
      apiClient = create({ url: LOCAL_API });
      return apiClient;
    }

    if (INFURA_ID && INFURA_SECRET) {
      const auth =
        typeof window !== "undefined"
          ? btoa(`${INFURA_ID}:${INFURA_SECRET}`)
          : Buffer.from(`${INFURA_ID}:${INFURA_SECRET}`).toString("base64");

      apiClient = create({
        url: "https://ipfs.infura.io:5001/api/v0",
        headers: {
          authorization: `Basic ${auth}`,
        },
      });
      return apiClient;
    }

    // No API client configured (will use public gateway for reads, but uploads are disabled)
    apiClient = undefined;
    return apiClient;
  } catch (err) {
    console.error("Failed to init IPFS client:", err);
    apiClient = undefined;
    return apiClient;
  }
};

export const useIPFS = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const makeGatewayUrl = (cid: string) =>
    USE_LOCAL ? `${LOCAL_GATEWAY}/${cid}` : `${PUBLIC_GATEWAY}/${cid}`;

  const uploadToIPFS = async (
    file: File
  ): Promise<{ hash: string; gateway: string }> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const client = initClient();

      if (!client) {
        throw new Error(
          "No IPFS API client configured. Enable local daemon (NEXT_PUBLIC_USE_LOCAL_IPFS=true) or set Infura credentials (NEXT_PUBLIC_INFURA_PROJECT_ID / NEXT_PUBLIC_INFURA_PROJECT_SECRET)."
        );
      }

      // convert file to Uint8Array
      const buffer = new Uint8Array(await file.arrayBuffer());

      // optional progress simulation/updates handled by client.progress when available
      const progressInterval = setInterval(() => {
        setUploadProgress((p) => Math.min(p + 8, 90));
      }, 200);

      const added = await client.add(
        { path: file.name, content: buffer },
        {
          cidVersion: 1,
          hashAlg: "sha2-256",
          progress: (bytes: number) => {
            const percent = Math.round((bytes / file.size) * 100);
            setUploadProgress(Math.min(percent, 90));
          },
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      const cid = added.cid?.toString?.() ?? String(added?.path ?? added);
      const gateway = makeGatewayUrl(cid);

      return { hash: cid, gateway };
    } catch (err: any) {
      console.error("IPFS upload failed:", err);
      // surface actionable error
      throw new Error(err?.message ?? "IPFS upload failed");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 800);
    }
  };

  const getFromIPFS = async (hash: string): Promise<string> => {
    // prefer API client cat, otherwise fetch from gateway
    try {
      const client = initClient();
      if (client) {
        const chunks: Uint8Array[] = [];
        for await (const chunk of client.cat(hash)) {
          chunks.push(chunk);
        }
        const total = chunks.reduce((acc, c) => acc + c.length, 0);
        const out = new Uint8Array(total);
        let offset = 0;
        for (const c of chunks) {
          out.set(c, offset);
          offset += c.length;
        }
        return new TextDecoder().decode(out);
      } else {
        // fallback to gateway fetch (CORS must allow this)
        const url = makeGatewayUrl(hash);
        const res = await fetch(url);
        if (!res.ok)
          throw new Error(
            `Gateway fetch failed: ${res.status} ${res.statusText}`
          );
        return await res.text();
      }
    } catch (err) {
      console.error("Failed to retrieve from IPFS:", err);
      throw new Error(err?.message ?? "Failed to retrieve data from IPFS");
    }
  };

  const pinToIPFS = async (hash: string): Promise<void> => {
    try {
      const client = initClient();
      if (!client) {
        throw new Error(
          "Pinning requires an IPFS API client (local daemon or Infura credentials)."
        );
      }
      await client.pin.add(hash);
    } catch (err) {
      console.error("Failed to pin to IPFS:", err);
      throw new Error(err?.message ?? "Failed to pin data to IPFS");
    }
  };

  return {
    uploadToIPFS,
    getFromIPFS,
    pinToIPFS,
    isUploading,
    uploadProgress,
    makeGatewayUrl,
  };
};
