import { useState, useEffect } from 'react';
import useWallet from '@/hooks/useWallet';
import useContract from '@/hooks/useContract';

export default function UpdateProfile() {
  const { account } = useWallet();
  const contract = useContract();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (account && contract) {
        try {
          const member = await contract.members(account);
          setName(member.name);
          setEmail(member.email);
        } catch (err) {
          console.error('Error fetching member details:', err);
          setError('Failed to fetch member details. Please try again.');
        }
      }
    };

    fetchMemberDetails();
  }, [account, contract]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account || !contract) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const tx = await contract.changeDetails(account, name, email);
      await tx.wait();

      setSuccess(true);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Update Your Profile</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">Profile updated successfully!</p>}
    </form>
  );
}