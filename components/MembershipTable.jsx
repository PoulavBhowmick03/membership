// src/components/MembershipsTable.jsx

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from 'react-toastify'; // For toast notifications
import { ethers } from 'ethers';

const MEMBERSHIP_TIERS = ["Basic", "Silver", "Gold", "Platinum"];

const MembershipsTable = ({ contract }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      if (contract) {
        try {
          setLoading(true);
          const memberAddresses = await contract.getAllMembers();
          const memberDataPromises = memberAddresses.map(async (address) => {
            const member = await contract.members(address);
            const tierName = MEMBERSHIP_TIERS[member.tier] || 'Unknown';
            const expirationDate = new Date(member.expiry_date.toNumber() * 1000).toLocaleDateString();
            return {
              address,
              name: member.name,
              email: member.email,
              tier: tierName,
              expirationDate,
            };
          });
          const membersData = await Promise.all(memberDataPromises);
          setMembers(membersData);
        } catch (error) {
          console.error("Error fetching members:", error);
          toast.error("Failed to fetch members.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMembers();
  }, [contract]);

  const handleRevoke = async (address) => {
    if (!contract) return;

    const confirmRevoke = window.confirm(`Are you sure you want to revoke membership for ${address}?`);
    if (!confirmRevoke) return;

    try {
      const tx = await contract.revokeMembership(address, { value: 0 }); // Assuming no ETH sent
      await tx.wait();
      toast.success(`Revoked membership for ${address}.`);
      // Refresh the members list
      setMembers(prev => prev.filter(member => member.address !== address));
    } catch (error) {
      console.error("Error revoking membership:", error);
      toast.error(`Failed to revoke membership for ${address}.`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (members.length === 0) {
    return <p>No members found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Wallet Address</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Membership Tier</TableHead>
            <TableHead>Expiration Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member, index) => (
            <TableRow key={index} className="hover:bg-gray-100">
              <TableCell className="font-mono text-sm truncate max-w-xs">{member.address}</TableCell>
              <TableCell>{member.name || 'N/A'}</TableCell>
              <TableCell>{member.email || 'N/A'}</TableCell>
              <TableCell>{member.tier}</TableCell>
              <TableCell>{member.expirationDate}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => handleRevoke(member.address)}>
                  Revoke
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembershipsTable;
