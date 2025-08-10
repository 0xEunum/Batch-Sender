export const ERC20BatchSenderAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "tSender__ArraysLengthShouldBeSame",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "tSender__InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "tSender__InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "tSender__InvalidAddress",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "tSender__TotalAmountMissMatched",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "tSender__TransferFailed",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "recipients",
        "type": "address[]"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalAmount",
        "type": "uint256"
      }
    ],
    "name": "Airdrop",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "recipients",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "totalAmount",
        "type": "uint256"
      }
    ],
    "name": "airdropERC20Tokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const