/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminPanel({ contract }) {
  const [newFees, setNewFees] = useState({
    Basic: '',
    Silver: '',
    Gold: '',
    Platinum: ''
  });
  const [newDuration, setNewDuration] = useState('');
  const [memberToRevoke, setMemberToRevoke] = useState('');
  const [currentFees, setCurrentFees] = useState({
    Basic: '',
    Silver: '',
    Gold: '',
    Platinum: ''
  });
  const [contractBalance, setContractBalance] = useState('');
  const [selectedTier, setSelectedTier] = useState('Basic');

  const tierEnumValues = {
    'Basic': 0,
    'Silver': 1,
    'Gold': 2,
    'Platinum': 3,
  };

  useEffect(() => {
    const fetchContractInfo = async () => {
      if (contract) {
        try {
          const tiers = ['Basic', 'Silver', 'Gold', 'Platinum'];
          const fees = await Promise.all(tiers.map(tier => 
            contract.tierFees(tierEnumValues[tier])
          ));
          const feesObj = {};
          tiers.forEach((tier, index) => {
            feesObj[tier] = ethers.utils.formatEther(fees[index].fee);
          });
          setCurrentFees(feesObj);

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
    if (contract && newFees[selectedTier] && newDuration) {
      try {
        const tx = await contract.changeMembershipFee(
          tierEnumValues[selectedTier],
          ethers.utils.parseEther(newFees[selectedTier]),
          ethers.BigNumber.from(newDuration)
        );
        await tx.wait();
        alert('Membership fee changed successfully!');
        setCurrentFees(prev => ({ ...prev, [selectedTier]: newFees[selectedTier] }));
        setNewFees(prev => ({ ...prev, [selectedTier]: '' }));
        setNewDuration('');
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
          {Object.entries(currentFees).map(([tier, fee]) => (
            <p key={tier}>{tier} Membership Fee: {fee} ETH</p>
          ))}
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
              <Label htmlFor="tier">Membership Tier</Label>
              <Select onValueChange={setSelectedTier} value={selectedTier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="newFee">New Fee (in ETH)</Label>
              <Input
                id="newFee"
                value={newFees[selectedTier]}
                onChange={(e) => setNewFees(prev => ({ ...prev, [selectedTier]: e.target.value }))}
                placeholder="Enter new fee"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="newDuration">New Duration (in days)</Label>
              <Input
                id="newDuration"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                placeholder="Enter new duration"
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