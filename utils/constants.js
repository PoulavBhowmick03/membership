export const ClubMembership = {
  address: "0x6dc0601247c7894348f08a9508e207ce419669fc",
  abi: [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_member",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "email",
          "type": "string"
        }
      ],
      "name": "changeDetails",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum ClubMembership.MembershipTier",
          "name": "_tier",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_newFee",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_newDuration",
          "type": "uint256"
        }
      ],
      "name": "changeMembershipFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_membershipFeeBasic",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_membershipFeeSilver",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_membershipFeeGold",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_membershipFeePlatinum",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "enum ClubMembership.MembershipTier",
          "name": "tier",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newFee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newDuration",
          "type": "uint256"
        }
      ],
      "name": "MembershipFeeChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "member",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum ClubMembership.MembershipTier",
          "name": "tier",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "expirationTime",
          "type": "uint256"
        }
      ],
      "name": "MembershipPurchased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "member",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newExpirationTime",
          "type": "uint256"
        }
      ],
      "name": "MembershipRenewed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "member",
          "type": "address"
        }
      ],
      "name": "MembershipRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "member",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum ClubMembership.MembershipTier",
          "name": "newTier",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newExpirationTime",
          "type": "uint256"
        }
      ],
      "name": "MembershipTierChanged",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "enum ClubMembership.MembershipTier",
          "name": "_tier",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "quater",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "email",
          "type": "string"
        }
      ],
      "name": "purchaseMembership",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renewMembership",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_member",
          "type": "address"
        }
      ],
      "name": "revokeMembership",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum ClubMembership.MembershipTier",
          "name": "_newTier",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "quater",
          "type": "uint256"
        }
      ],
      "name": "upgradeMembership",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "get_block",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllMembers",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_member",
          "type": "address"
        }
      ],
      "name": "getMemberExpirationTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_member",
          "type": "address"
        }
      ],
      "name": "getMemberTier",
      "outputs": [
        {
          "internalType": "enum ClubMembership.MembershipTier",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_member",
          "type": "address"
        }
      ],
      "name": "isActiveMember",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "memberAddresses",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "members",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isMember",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "expiry_date",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "email",
          "type": "string"
        },
        {
          "internalType": "enum ClubMembership.MembershipTier",
          "name": "tier",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum ClubMembership.MembershipTier",
          "name": "",
          "type": "uint8"
        }
      ],
      "name": "tierFees",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
};
export default ClubMembership;
