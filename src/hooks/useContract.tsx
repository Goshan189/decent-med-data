import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import MedicalDataRegistry from '../contracts/MedicalDataRegistry.json';

export const useContract = () => {
  const { provider, account } = useWallet();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (provider && account) {
      const initContract = async () => {
        try {
          const signer = await provider.getSigner();
          const contractInstance = new ethers.Contract(
            MedicalDataRegistry.address,
            MedicalDataRegistry.abi,
            signer
          );
          setContract(contractInstance);
        } catch (error) {
          console.error('Failed to initialize contract:', error);
        }
      };
      
      initContract();
    }
  }, [provider, account]);

  const registerPatient = async (name: string, email: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    setIsLoading(true);
    try {
      const tx = await contract.registerPatient(name, email);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to register patient:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerMedicalData = async (ipfsHash: string, patientName: string, dataType: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    setIsLoading(true);
    try {
      const tx = await contract.registerMedicalData(ipfsHash, patientName, dataType);
      const receipt = await tx.wait();
      
      // Extract dataHash from event logs
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed.name === 'DataRegistered';
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsed = contract.interface.parseLog(event);
        return {
          txHash: tx.hash,
          dataHash: parsed.args.dataHash
        };
      }
      
      return { txHash: tx.hash, dataHash: null };
    } catch (error) {
      console.error('Failed to register medical data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const makeDataPublic = async (dataHash: string, price: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    setIsLoading(true);
    try {
      const priceInWei = ethers.parseEther(price);
      const tx = await contract.makeDataPublic(dataHash, priceInWei);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to make data public:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseDataAccess = async (dataHash: string, price: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    setIsLoading(true);
    try {
      const priceInWei = ethers.parseEther(price);
      const tx = await contract.purchaseDataAccess(dataHash, { value: priceInWei });
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to purchase data access:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyDataIntegrity = async (dataHash: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const result = await contract.verifyDataIntegrity(dataHash);
      return {
        isValid: result[0],
        ipfsHash: result[1],
        owner: result[2],
        timestamp: Number(result[3])
      };
    } catch (error) {
      console.error('Failed to verify data integrity:', error);
      throw error;
    }
  };

  const getPublicDataList = async () => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const dataHashes = await contract.getPublicDataList();
      
      // Get details for each data hash
      const dataDetails = await Promise.all(
        dataHashes.map(async (hash: string) => {
          const details = await contract.getMedicalData(hash);
          return {
            dataHash: hash,
            ipfsHash: details[0],
            patientName: details[1],
            dataType: details[2],
            timestamp: Number(details[3]),
            owner: details[4],
            isPublic: details[5],
            price: ethers.formatEther(details[6])
          };
        })
      );
      
      return dataDetails;
    } catch (error) {
      console.error('Failed to get public data list:', error);
      throw error;
    }
  };

  const getMedicalData = async (dataHash: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const result = await contract.getMedicalData(dataHash);
      return {
        ipfsHash: result[0],
        patientName: result[1],
        dataType: result[2],
        timestamp: Number(result[3]),
        owner: result[4],
        isPublic: result[5],
        price: ethers.formatEther(result[6])
      };
    } catch (error) {
      console.error('Failed to get medical data:', error);
      throw error;
    }
  };

  return {
    contract,
    isLoading,
    registerPatient,
    registerMedicalData,
    makeDataPublic,
    purchaseDataAccess,
    verifyDataIntegrity,
    getPublicDataList,
    getMedicalData,
    isContractReady: !!contract
  };
};