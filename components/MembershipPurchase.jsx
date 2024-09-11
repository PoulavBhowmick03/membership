import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ConnectWallet from "./ConnectWallet";
import useWallet from "@/hooks/useWallet";

export default function MembershipPurchase({ contract }) {
  const [membershipFee, setMembershipFee] = useState("0");
  const { account, connect, disconnect, switchWallet } = useWallet();

  useEffect(() => {
    const getFee = async () => {
      if (contract) {
        const fee = await contract.membershipFee();
        setMembershipFee(ethers.utils.formatEther(fee));
      }
    };
    getFee();
  }, [contract]);

  const purchaseMembership = async () => {
    if (contract) {
      try {
        const tx = await contract.purchaseMembership({
          value: ethers.utils.parseEther(membershipFee),
        });
        await tx.wait();
        alert("Membership purchased successfully!");
      } catch (error) {
        console.error("Error purchasing membership:", error);
        alert("Failed to purchase membership. Please try again.");
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Purchase Membership</h2>
      <p>Membership Fee: {membershipFee} ETH</p>
      <button
        onClick={purchaseMembership}
        className="bg-green-500 text-white px-4 py-2 rounded mt-2"
      >
        Purchase Membership
      </button>
      <ConnectWallet
        account={account}
        connect={connect}
        disconnect={disconnect}
        switchWallet={switchWallet}
      />
    </div>
  );
}
