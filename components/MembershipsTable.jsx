import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function MembershipsTable({ contract }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      if (contract) {
        try {
          setLoading(true);
          const memberAddresses = await contract.getAllMembers();
          const membersData = await Promise.all(memberAddresses.map(async (address) => {
            const member = await contract.members(address);
            return {
              address,
              name: member.name,
              email: member.email,
              tier: ['Basic', 'Silver', 'Gold', 'Platinum'][member.tier],
              expiryDate: new Date(member.expiry_date.toNumber() * 1000)
            };
          }));
          setMembers(membersData);
        } catch (error) {
          console.error('Error fetching members:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMembers();
  }, [contract]);

  const filteredMembers = members.filter(member =>
    member.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const revokeMembership = async (address) => {
    if (contract) {
      try {
        const tx = await contract.revokeMembership(address);
        await tx.wait();
        alert('Membership revoked successfully!');
        // Refresh the member list
        const updatedMembers = members.filter(member => member.address !== address);
        setMembers(updatedMembers);
      } catch (error) {
        console.error('Error revoking membership:', error);
        alert('Failed to revoke membership. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search by address, name, or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table>
        <TableCaption>A list of all current club members.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => (
            <TableRow key={member.address}>
              <TableCell>{member.address}</TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.tier}</TableCell>
              <TableCell>{member.expiryDate.toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => revokeMembership(member.address)}>
                  Revoke
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}