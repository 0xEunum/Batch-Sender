# Batch-Sender

A decentralized application (**dApp**) that enables users to send **ERC-20 tokens** to multiple recipients in a single transaction **saving time, reducing fees, and simplifying large-scale token distribution**. Built with a **secure smart contract** and a **modern, intuitive frontend**.

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

The **`ERC20BatchSender`** contract powers the batch token transfers, with strict input validation to ensure safety.

### Core Function

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

---

## 🌍 Deployment

- **`ERC20BatchSender`** deployed on **Sepolia testnet**.
- Full contract source available in the [`/contracts`](./contracts) directory.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.
