# 🇳🇵 Janamat Forum : Privacy-Preserving, Solana-Backed Opinion Sharing

[![Node.js](https://img.shields.io/badge/Node.js-19.x-brightgreen)](https://nodejs.org/)
[![Solana](https://img.shields.io/badge/Solana-solana%20cli%203.0.x-blue)](https://reactnative.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-black)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Built for the **Superteam Nepal University Tour - Sunway College Mini-Hack**.


## 🚀 Mission

Janamat Forum is a decentralized platform designed to empower Nepali tech talent and citizens to share opinions freely and securely. By leveraging the Solana blockchain, we ensure that every vote is transparent and immutable, while maintaining user privacy through wallet-based identity.

## ✨ Key Features

- **Wallet-Based Identity**: No emails, no passwords. Sign in with Phantom or Solflare on MVP. Can be integrated with Janamat's native website later on.
- **On-Chain Governance**: Votes (Upvotes/Downvotes) are recorded directly on the Solana blockchain.
- **Daily Forum Limit**: Prevents spam by enforcing a 1-forum-per-day limit per wallet using Solana Program Derived Addresses (PDAs).
- **Hybrid Architecture**: Fast metadata and comment retrieval via a MongoDB backend, with critical state (votes/limits) secured on-chain.
- **Cyber-Glass Aesthetics**: A premium, modern UI built with Next.js, Tailwind CSS, and Framer Motion.

---

## 🏗️ Technical Architecture

Janamat Forum uses a hybrid "Web 2.5" approach to balance speed and decentralization:

### 1. On-Chain (Solana/Anchor)

- **Forum Accounts**: Stores vote counts and creator metadata.
- **Daily Limit PDAs**: Enforces the "one forum per day" rule.
- **Vote PDAs**: Prevents double-voting by mapping `(voter, forum)` to a unique account.

### 2. Off-Chain (Node.js/MongoDB)

- **Metadata Storage**: Stores forum titles, descriptions, and timestamps for fast indexing and search.
- **Comments**: High-frequency data (comments) are stored off-chain to save on transaction costs for users.
- **Signature Verification**: All backend writes require a cryptographic signature from the user's wallet to ensure authenticity.

---

## 🛠️ Tech Stack

- **Blockchain**: Solana (Anchor Framework, Rust)
- **Frontend**: Next.js 15+, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Client Libraries**: `@solana/web3.js`, `@coral-xyz/anchor`
- **Wallets**: Phantom, Solflare

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 18+
- Rust & Anchor CLI
- Solana CLI
- MongoDB (running locally or via Atlas)

### 1. Solana Program (Anchor)

```bash
cd janamat_forum
anchor build

# Start a local validator if not running
solana-test-validator --reset

# Deploy to localnet
anchor deploy

# Copy the generated IDL to the frontend
cp target/idl/janamat_forum.json ../frontend/src/lib/idl.json

solana account J5t84a3NbVBUEzi3qfaQBTVpT5egmV6e6E6MeQfr7yHi --url http://localhost:8899
```

### 2. Backend API

```bash
cd backend
npm install

# Create a .env file
echo "PORT=3001
MONGODB_URI=mongodb://localhost:27017/janamat_forum
NODE_ENV=development" > .env

npm run dev
```

### 3. Frontend Application

```bash
cd frontend
npm install

# Create a .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local

npm run dev
```

---

## 🔧 Technical Highlights (The "Vibecode" Fixes)

During development, we solved several critical challenges:

- **PDA Seed Stability**: Fixed a common Anchor issue where `Clock::get()?` was used in seeds, leading to IDL generation failures. We refactored the program to pass `date` as an instruction argument, ensuring stable PDA derivation.
- **Hydration Sync**: Resolved Next.js hydration mismatches caused by wallet adapter injection using client-side mounting checks.
- **On-Chain Sync**: Implemented real-time on-chain data fetching in the frontend to merge live Solana vote counts with backend metadata.

---

## 🔗 Resources

- [Anchor Book](https://www.anchor-lang.com/)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)
- [Superteam Nepal](https://nepal.superteam.fun/)

---

## 👥 Authors

- **Prashant** - Lead Developer (Author)

## 📝 License

This project is licensed under the MIT License.
