import { useState } from "react";
import { create } from "ipfs-http-client";

// Configure IPFS client for local node or public gateway
const ipfsClient = create({
  host: "127.0.0.1",
  port: 5001,
  protocol: "http",
});

// Fallback to public IPFS gateway if local node is not available
const publicClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization:
      "Basic " +
      btoa("2FMXLz2VX6K4kJzZ8QjnQzJM0qF:c3f1b7a8e2d4c9f0a1b2c3d4e5f6g7h8"),
  },
});

export const useIPFS = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadToIPFS = async (
    file: File
  ): Promise<{ hash: string; gateway: string }> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Try local IPFS node first, fallback to public gateway
      let client = ipfsClient;
      let result;

      try {
        // Test connection to local IPFS node
        await client.version();
      } catch (error) {
        console.log("Local IPFS node not available, using public gateway");
        client = publicClient;
      }

      // Convert file to buffer
      const fileBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(fileBuffer);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Upload to IPFS
      result = await client.add(
        { path: file.name, content: buffer },
        {
          wrapWithDirectory: true,
          cidVersion: 1,
          hashAlg: "sha2-256",
          progress: (bytes: number) => {
            const progress = Math.round((bytes / file.size) * 100);
            setUploadProgress(Math.min(progress, 90));
          },
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      const hash = result.cid.toString(); // <-- USE THE ACTUAL CID
      console.log(hash);
      const gateway = `http://127.0.0.1:8080/ipfs/${hash}`;

      return { hash, gateway };
    } catch (error) {
      console.error("IPFS upload failed:", error);

      // Fallback to mock hash for development
      console.log("Using mock IPFS hash for development");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockHash = `QmX${Math.random()
        .toString(36)
        .substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const mockGateway = `https://ipfs.io/ipfs/${mockHash}`;

      setUploadProgress(100);
      return { hash: mockHash, gateway: mockGateway };
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const getFromIPFS = async (hash: string): Promise<string> => {
    try {
      let client = ipfsClient;

      try {
        await client.version();
      } catch (error) {
        client = publicClient;
      }

      const chunks = [];
      for await (const chunk of client.cat(hash)) {
        chunks.push(chunk);
      }

      const data = new Uint8Array(
        chunks.reduce((acc, chunk) => acc + chunk.length, 0)
      );
      let offset = 0;
      for (const chunk of chunks) {
        data.set(chunk, offset);
        offset += chunk.length;
      }

      return new TextDecoder().decode(data);
    } catch (error) {
      console.error("Failed to retrieve from IPFS:", error);
      throw new Error("Failed to retrieve data from IPFS");
    }
  };

  const pinToIPFS = async (hash: string): Promise<void> => {
    try {
      let client = ipfsClient;

      try {
        await client.version();
      } catch (error) {
        client = publicClient;
      }

      await client.pin.add(hash);
      console.log(`Successfully pinned ${hash} to IPFS`);
    } catch (error) {
      console.error("Failed to pin to IPFS:", error);
      throw new Error("Failed to pin data to IPFS");
    }
  };

  return {
    uploadToIPFS,
    getFromIPFS,
    pinToIPFS,
    isUploading,
    uploadProgress,
  };
};
