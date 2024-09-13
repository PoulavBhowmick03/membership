'use client'

import React, { useState, useEffect } from 'react';
import useWallet from '../../hooks/useWallet';
import useContract from '../../hooks/useContract';
import ConnectWallet from '@/components/ConnectWallet';
import AdminPanel from '@/components/AdminPanel';
import MembershipsTable from '@/components/MembershipsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const { account, connect, disconnect, switchWallet } = useWallet();
  const contract = useContract();
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkOwnership = async () => {
      if (account && contract) {
        try {
          setLoading(true);
          const owner = await contract.owner();
          setIsOwner(owner.toLowerCase() === account.toLowerCase());
        } catch (err) {
          console.error('Error checking ownership:', err);
          setError('Failed to check contract ownership. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkOwnership();
  }, [account, contract]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );

  if (error) return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <ConnectWallet
        account={account}
        connect={connect}
        disconnect={disconnect}
        switchWallet={switchWallet}
      />
      {account && !isOwner && (
        <Alert className="mt-4" variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have admin access to this contract.</AlertDescription>
        </Alert>
      )}
      {isOwner && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
            <CardDescription>Manage your Club Membership contract</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manage">
              <TabsList>
                <TabsTrigger value="manage">Manage Contract</TabsTrigger>
                <TabsTrigger value="memberships">Current Memberships</TabsTrigger>
              </TabsList>
              <TabsContent value="manage">
                <AdminPanel contract={contract} />
              </TabsContent>
              <TabsContent value="memberships">
                <MembershipsTable contract={contract} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}