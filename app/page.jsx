
/* eslint-disable react/no-unescaped-entities */
"use client"
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import useWallet from '@/hooks/useWallet';
import useContract from '@/hooks/useContract';
import { motion } from "framer-motion";
import {
  LockClosedIcon,
  LockOpenIcon,
  CurrencyDollarIcon,
  ArrowUpCircleIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import ConnectWallet from "@/components/ConnectWallet";

export default function MembershipApp() {
  const contract = useContract();
  const [isMember, setIsMember] = useState(false);
  const [membershipTier, setMembershipTier] = useState(null);
  const [membershipFees, setMembershipFees] = useState({});
  const [expirationTime, setExpirationTime] = useState(null);
  const [selectedTier, setSelectedTier] = useState(0);
  const [quarters, setQuarters] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { account, connect, disconnect, switchWallet } = useWallet();

  useEffect(() => {
    const checkMembership = async () => {
      if (account && contract) {
        try {
          const memberStatus = await contract.isActiveMember(account);
          setIsMember(memberStatus);
          if (memberStatus) {
            const memberDetails = await contract.members(account);
            setMembershipTier(memberDetails.tier);
            setExpirationTime(new Date(memberDetails.expiry_date.toNumber() * 1000));
            setName(memberDetails.name);
            setEmail(memberDetails.email);
          }
        } catch (error) {
          console.error("Error checking membership:", error);
        }
      }
    };

    const getFees = async () => {
      if (contract) {
        try {
          const tiers = ['Basic', 'Silver', 'Gold', 'Platinum'];
          const fees = {};
          for (let i = 0; i < tiers.length; i++) {
            const tierFee = await contract.tierFees(i);
            fees[tiers[i]] = ethers.utils.formatEther(tierFee.fee);
          }
          setMembershipFees(fees);
        } catch (error) {
          console.error("Error fetching membership fees:", error);
        }
      }
    };

    checkMembership();
    getFees();
  }, [account, contract]);

  const purchaseMembership = async () => {
    if (contract) {
      try {
        const fee = ethers.utils.parseEther(membershipFees[Object.keys(membershipFees)[selectedTier]]);
        const tx = await contract.purchaseMembership(selectedTier, quarters, name, email, {
          value: fee.mul(quarters),
        });
        await tx.wait();
        setIsMember(true);
        alert("Membership purchased successfully!");
        checkMembership();
      } catch (error) {
        console.error("Error purchasing membership:", error);
      }
    }
  };

  const upgradeMembership = async () => {
    if (contract && membershipTier !== null) {
      try {
        const newTier = membershipTier + 1;
        const fee = ethers.utils.parseEther(membershipFees[Object.keys(membershipFees)[newTier]]);
        const tx = await contract.upgradeMembership(newTier, quarters, {
          value: fee.mul(quarters),
        });
        await tx.wait();
        alert("Membership upgraded successfully!");
        checkMembership();
      } catch (error) {
        console.error("Error upgrading membership:", error);
      }
    }
  };

  const renewMembership = async () => {
    if (contract) {
      try {
        const fee = ethers.utils.parseEther(membershipFees[Object.keys(membershipFees)[membershipTier]]);
        const tx = await contract.renewMembership({
          value: fee,
        });
        await tx.wait();
        alert("Membership renewed successfully!");
        checkMembership();
      } catch (error) {
        console.error("Error renewing membership:", error);
      }
    }
  };

  const changeDetails = async () => {
    if (contract) {
      try {
        const tx = await contract.changeDetails(account, name, email);
        await tx.wait();
        alert("Details updated successfully!");
        checkMembership();
      } catch (error) {
        console.error("Error updating details:", error);
      }
    }
  };

  return (
    <div className="min-h-screen p-14 bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-2">
            Welcome to the Club
          </h1>
          <p className="text-center text-gray-600">
            Experience exclusive benefits and connect with like-minded individuals.
          </p>
        </div>

        {!account ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={connect}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Connect Wallet
          </motion.button>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">Connected Account:</p>
              <p className="font-mono text-sm truncate">{account}</p>
            </div>

            {isMember ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-green-100 rounded-lg p-6 text-center"
              >
                <LockOpenIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-green-800 mb-2">
                  You're a Member!
                </h2>
                <p className="text-green-600 mb-2">
                  Tier: {['Basic', 'Silver', 'Gold', 'Platinum'][membershipTier]}
                </p>
                <p className="text-green-600 mb-2">
                  Name: {name}
                </p>
                <p className="text-green-600 mb-4">
                  Email: {email}
                </p>
                <p className="text-green-600 mb-4">
                  Expires on: {expirationTime?.toLocaleDateString()}
                </p>
                <div className="space-y-2">
                  {membershipTier < 3 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={upgradeMembership}
                      className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <ArrowUpCircleIcon className="h-5 w-5 mr-2" />
                      Upgrade Membership
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={renewMembership}
                    className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                    Renew Membership
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={changeDetails}
                    className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <PencilIcon className="h-5 w-5 mr-2" />
                    Update Details
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-yellow-100 rounded-lg p-6 text-center"
              >
                <LockClosedIcon className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-yellow-800 mb-4">
                  Become a Member
                </h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Membership Tier
                  </label>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(Number(e.target.value))}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {Object.entries(membershipFees).map(([tier, fee], index) => (
                      <option key={tier} value={index}>
                        {tier} - {fee} ETH
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Quarters
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={quarters}
                    onChange={(e) => setQuarters(Number(e.target.value))}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={purchaseMembership}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  Purchase Membership
                </motion.button>
              </motion.div>
            )}
            <ConnectWallet
              account={account}
              connect={connect}
              disconnect={disconnect}
              switchWallet={switchWallet}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}