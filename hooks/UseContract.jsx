import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ClubMembership } from '@/utils/constants';

const useContract = () => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contractInstance = new ethers.Contract(ClubMembership.address, ClubMembership.abi, signer);
          
          console.log("Contract instance:", contractInstance);
          
          setContract(contractInstance);
        } catch (error) {
          console.error("Failed to initialize contract:", error);
        }
      }
    };

    initContract();
  }, []);

  return contract;
}

export default useContract;

