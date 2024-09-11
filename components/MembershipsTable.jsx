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
          // This is a placeholder. You'll need to implement a way to fetch all members.
          // This might require adding a function to your smart contract to return all member addresses.
          const memberAddresses = await contract.getAllMembers();
          const membersData = await Promise.all(memberAddresses.map(async (address) => {
            const purchaseTime = await contract.membershipPurchaseTime(address);
            return { address, purchaseTime: new Date(purchaseTime.toNumber() * 1000) };
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
    member.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          placeholder="Search by address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table>
        <TableCaption>A list of all current club members.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Membership Purchase Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => (
            <TableRow key={member.address}>
              <TableCell>{member.address}</TableCell>
              <TableCell>{member.purchaseTime.toLocaleString()}</TableCell>
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