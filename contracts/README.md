# Medical Data Blockchain Smart Contracts

This directory contains the Solidity smart contracts for the Medical Data Registry blockchain application.

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Truffle Suite
- Ganache CLI or Ganache GUI
- MetaMask Browser Extension

### 1. Install Dependencies
```bash
npm install -g truffle
npm install -g ganache-cli
npm install ethers
```

### 2. Start Local Blockchain
```bash
# Option 1: Using Ganache CLI
ganache-cli --port 8545 --deterministic

# Option 2: Using Ganache GUI
# Download and install Ganache GUI
# Create new workspace with RPC Server at HTTP://127.0.0.1:8545
```

### 3. Compile Smart Contracts
```bash
truffle compile
```

### 4. Deploy Contracts
```bash
truffle migrate --network development
```

### 5. Update Frontend Configuration
After deployment, update the contract address in:
`src/contracts/MedicalDataRegistry.json`

## Smart Contract Features

### MedicalDataRegistry.sol
- **Patient Registration**: Register patients with name and email
- **Data Registration**: Register medical data with IPFS hashes
- **Access Control**: Make data public with pricing
- **Purchase System**: Buy access to medical data with ETH
- **Verification**: Verify data integrity on blockchain
- **Event Logging**: All transactions logged as events

### Key Functions
- `registerPatient(name, email)` - Register a new patient
- `registerMedicalData(ipfsHash, patientName, dataType)` - Register medical data
- `makeDataPublic(dataHash, price)` - Make data available for purchase
- `purchaseDataAccess(dataHash)` - Buy access to data
- `verifyDataIntegrity(dataHash)` - Verify data exists and get details

## IPFS Integration

The contracts work with IPFS for decentralized file storage:

1. **Upload Flow**: Files → IPFS → Get Hash → Register on Blockchain
2. **Verification**: Hash on Blockchain → Verify IPFS Content
3. **Access**: Purchase Access → Get IPFS Hash → Download Content

## Development Workflow

1. Start Ganache local blockchain
2. Deploy contracts using Truffle
3. Connect MetaMask to local network (http://127.0.0.1:8545)
4. Import Ganache accounts to MetaMask
5. Use frontend application to interact with contracts

## Network Configuration

### Local Development (Ganache)
- Network ID: 1337 (or 5777 for Ganache GUI)
- RPC URL: http://127.0.0.1:8545
- Chain ID: 1337

### MetaMask Setup
1. Add Custom Network in MetaMask:
   - Network Name: "Ganache Local"
   - RPC URL: "http://127.0.0.1:8545"
   - Chain ID: 1337
   - Currency Symbol: ETH

## Testing

```bash
# Run contract tests
truffle test

# Run specific test file
truffle test ./test/MedicalDataRegistry.test.js
```

## Deployment to Testnets

### Sepolia Testnet
1. Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
2. Update `truffle-config.js` with Sepolia configuration
3. Deploy: `truffle migrate --network sepolia`

### Polygon Mumbai
1. Get test MATIC from [Mumbai Faucet](https://faucet.polygon.technology/)
2. Update `truffle-config.js` with Mumbai configuration
3. Deploy: `truffle migrate --network mumbai`

## Security Considerations

- All medical data stored on IPFS (off-chain)
- Only hashes and metadata stored on-chain
- Access control enforced by smart contracts
- Patient owns their data and controls access
- Immutable audit trail of all transactions

## Gas Optimization

- Use events for data retrieval instead of storage when possible
- Batch operations to reduce transaction costs
- Consider layer 2 solutions for production deployment