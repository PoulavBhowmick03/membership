"use client";
import { useState, useEffect } from 'react';
import useWallet from '@/hooks/useWallet';
import useContract from '@/hooks/useContract';
import UpdateProfile from '@/components/UpdateProfile';
import Loading from '@/components/Loading';
import Error from '@/components/Error';
import ConnectWallet from '@/components/ConnectWallet';

export default function MembersPage() {
  const { account, connect, disconnect, switchWallet } = useWallet();
  const contract = useContract();
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkMembership = async () => {
      if (account && contract) {
        try {
          setLoading(true);
          const memberStatus = await contract.isMember(account);
          setIsMember(memberStatus);
        } catch (err) {
          console.error('Error checking membership:', err);
          setError('Failed to check membership status. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    checkMembership();
  }, [account, contract]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  if (!account) {
    return <div>Please connect your wallet to access this page.</div>;
  }
  if (!isMember) {
    return <div>This page is only accessible to club members.
            <ConnectWallet
        account={account}
        connect={connect}
        disconnect={disconnect}
        switchWallet={switchWallet}
      />
    </div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-4">Members Only Area</h1>
      <p className="mb-4">Welcome to the exclusive members area! Here you can access special content and features.</p>
      <UpdateProfile />
      <ConnectWallet
        account={account}
        connect={connect}
        disconnect={disconnect}
        switchWallet={switchWallet}
      />
      {/* Add more member-only content here */}
    </div>
  );
}