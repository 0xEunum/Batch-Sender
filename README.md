# Batch-Sender

A decentralized application (**dApp**) that enables users to send **ERC-20 tokens and ERC-721 tokens** to multiple recipients in a single transaction **saving time, reducing fees, and simplifying large-scale token distribution**. Built with a **secure smart contract** and a **modern, intuitive frontend**.

---

## 🚀 Features

- **🔗 Wallet Connection** — Supports MetaMask, WalletConnect, and other Ethereum-compatible wallets.
- **⚡ Dynamic Token Input** — Automatically fetches token details (_name, symbol, decimals_) from any ERC-20 address.
- **📦 Batch Sending** — Send tokens to multiple recipients in **one** transaction.
- **🛡 Validation & Safety** — Ensures correct addresses, matching array lengths, sufficient allowance, and balance before execution.
- **✅ Approval & Execution** — Smooth approval flow followed by a single send action.
- **📢 Live Feedback** — Real-time transaction updates with direct block explorer links.
- **📱 Responsive UI** — Optimized for both desktop and mobile devices.

---

## 🛠 Getting Started

### Prerequisites

- **Node.js** v18+
- **pnpm** (recommended) or npm/yarn

### Installation

```bash
# Clone repository
git clone https://github.com/0xEunum/Batch-Sender.git
cd Batch-Sender/frontend

# Install dependencies
pnpm install
```

### Running Locally

```bash
pnpm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📖 Usage

1. **Connect** your Ethereum wallet.
2. **Enter** the ERC-20 token address.
3. **Add** recipient addresses and corresponding amounts.
4. **Approve** token spending (if not already approved).
5. **Send** tokens to all recipients in a single transaction.
6. **Track** the transaction on a block explorer.

---

## 📝 Smart Contract Overview

The core of this project is a **Batch Sender contract** designed for **safe and efficient mass transfers** of both **ERC-20** and **ERC-721 tokens**. It handles strict input validation and minimizes risks of incorrect transfers.

### ERC20 Batch Sending
The `airdropERC20Tokens` function powers the batch token transfers, with strict input validation to ensure safety.

```solidity
function airdropERC20Tokens(
    address tokenAddress,
    address[] calldata recipients,
    uint256[] calldata amounts,
    uint256 totalAmount
) external
```

**Security Checks:**

- ❌ Rejects zero addresses.
- 📏 Validates equal length for recipients and amounts arrays.
- 🧮 Ensures `totalAmount` matches the sum of `amounts`.
- 💰 Confirms sufficient **allowance** and **balance**.
- 🔄 Executes token transfers in a single loop.

### ERC721 Batch Sending
The `batchTransferERC721` function introduces NFT batch transfers, enabling users to send multiple NFTs to multiple recipients in a single transaction.

```solidity
function batchTransferERC721(
    address tokenAddress,
    address[] calldata recipients,
    uint256[] calldata tokenIds
) external nonReentrant
```

**Security Ckecks:**
- ❌ Rejects zero addresses.
- 📏 Requires equal length for recipients and tokenIds arrays.
- 👤 Ensures caller is owner (or approved operator) of each NFT before transfer.
- 🔄 Executes safeTransferFrom in a single loop for all recipients.

---

## 🌍 Deployment

- **ERC20 Batch Sender** deployed on:  
  - Ethereum Sepolia  
  - ZKSync Sepolia  
  - Arbitrum Sepolia  
  - Optimism Sepolia  

- **ERC721 Batch Sender** deployed on:  
  - Ethereum Sepolia  

📂 Full contract source is available in the [`/contracts`](./contracts) directory.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.
