/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import useWallet from '@/hooks/useWallet';
import useContract from '@/hooks/useContract';
import { motion } from "framer-motion";
import {
  LockClosedIcon,
  LockOpenIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import ConnectWallet from "@/components/ConnectWallet";

export default function MembershipApp() {
  const contract = useContract();
  const [isMember, setIsMember] = useState(false);
  const [membershipFee, setMembershipFee] = useState("0");
  const [purchaseTime, setPurchaseTime] = useState(null);
  const { account, connect, disconnect, switchWallet } = useWallet();

  useEffect(() => {
    const checkMembership = async () => {
      if (account && contract) {
        const memberStatus = await contract.isMember(account);
        setIsMember(memberStatus);
        if (memberStatus) {
          const time = await contract.membershipPurchaseTime(account);
          setPurchaseTime(new Date(time.toNumber() * 1000));
        }
      }
    };

    const getFee = async () => {
      if (contract) {
        const fee = await contract.membershipFee();
        setMembershipFee(ethers.utils.formatEther(fee));
      }
    };

    checkMembership();
    getFee();
  }, [account, contract]);

  const purchaseMembership = async () => {
    if (contract) {
      try {
        const tx = await contract.purchaseMembership({
          value: ethers.utils.parseEther(membershipFee),
        });
        await tx.wait();
        setIsMember(true);
        alert("Membership purchased successfully!");
      } catch (error) {
        console.error("Error purchasing membership:", error);
        alert("Failed to purchase membership. Please try again.");
      }
    }
  };

  return (
    <div className="h-auto p-14 bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-82 bg-white p-10 rounded-xl shadow-2xl"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-2">
            Welcome to the Club
          </h1>
          <p className="text-center text-gray-600">
            Experience exclusive benefits and connect with like-minded
            individuals.
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
                {purchaseTime && (
                  <p className="text-green-600">
                    Joined on: {purchaseTime.toLocaleDateString()}
                  </p>
                )}
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
                <p className="text-yellow-800 mb-4">
                  Membership Fee:{" "}
                  <span className="font-bold">{membershipFee} ETH</span>
                </p>
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
