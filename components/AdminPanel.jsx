import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AdminPanel({ contract }) {
  const [newFee, setNewFee] = useState('');
  const [memberToRevoke, setMemberToRevoke] = useState('');
  const [currentFee, setCurrentFee] = useState('');
  const [contractBalance, setContractBalance] = useState('');

  useEffect(() => {
    const fetchContractInfo = async () => {
      if (contract) {
        try {
          const fee = await contract.membershipFee();
          setCurrentFee(ethers.utils.formatEther(fee));

          const balance = await contract.provider.getBalance(contract.address);
          setContractBalance(ethers.utils.formatEther(balance));
        } catch (error) {
          console.error('Error fetching contract info:', error);
        }
      }
    };

    fetchContractInfo();
  }, [contract]);

  const changeMembershipFee = async () => {
    if (contract && newFee) {
      try {
        const tx = await contract.changeMembershipFee(ethers.utils.parseEther(newFee));
        await tx.wait();
        alert('Membership fee changed successfully!');
        setCurrentFee(newFee);
        setNewFee('');
      } catch (error) {
        console.error('Error changing membership fee:', error);
        alert('Failed to change membership fee. Please try again.');
      }
    }
  };

  const revokeMembership = async () => {
    if (contract && memberToRevoke) {
      try {
        const tx = await contract.revokeMembership(memberToRevoke);
        await tx.wait();
        alert('Membership revoked successfully!');
        setMemberToRevoke('');
      } catch (error) {
        console.error('Error revoking membership:', error);
        alert('Failed to revoke membership. Please try again.');
      }
    }
  };

  const withdrawFunds = async () => {
    if (contract) {
      try {
        const tx = await contract.withdrawFunds();
        await tx.wait();
        alert('Funds withdrawn successfully!');
        setContractBalance('0');
      } catch (error) {
        console.error('Error withdrawing funds:', error);
        alert('Failed to withdraw funds. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contract Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Current Membership Fee: {currentFee} ETH</p>
          <p>Contract Balance: {contractBalance} ETH</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Membership Fee</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="newFee">New Fee (in ETH)</Label>
              <Input
                id="newFee"
                value={newFee}
                onChange={(e) => setNewFee(e.target.value)}
                placeholder="Enter new fee"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={changeMembershipFee}>Change Fee</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revoke Membership</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="memberAddress">Member Address</Label>
              <Input
                id="memberAddress"
                value={memberToRevoke}
                onChange={(e) => setMemberToRevoke(e.target.value)}
                placeholder="Enter member address"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={revokeMembership} variant="destructive">Revoke Membership</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Withdraw Funds</CardTitle>
          <CardDescription>Withdraw all funds from the contract</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={withdrawFunds} variant="outline">Withdraw All Funds</Button>
        </CardFooter>
      </Card>
    </div>
  );
}