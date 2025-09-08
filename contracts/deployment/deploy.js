const { ethers } = require("ethers");
const fs = require("fs");

// Deploy script for MedicalDataRegistry contract
async function deployMedicalDataRegistry() {
    // Connect to local Ganache network
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    
    // Use the first account from Ganache
    const signer = await provider.getSigner(0);
    
    console.log("Deploying contracts with account:", await signer.getAddress());
    console.log("Account balance:", ethers.formatEther(await provider.getBalance(await signer.getAddress())));
    
    // Read contract source
    const contractSource = fs.readFileSync("../MedicalDataRegistry.sol", "utf8");
    
    // Compile contract (in production, use proper compiler setup)
    const contractFactory = new ethers.ContractFactory(
        JSON.parse(fs.readFileSync("./MedicalDataRegistry.abi.json")),
        fs.readFileSync("./MedicalDataRegistry.bin", "utf8"),
        signer
    );
    
    // Deploy contract
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    
    const contractAddress = await contract.getAddress();
    console.log("MedicalDataRegistry deployed to:", contractAddress);
    
    // Save deployment info
    const deploymentInfo = {
        address: contractAddress,
        abi: JSON.parse(fs.readFileSync("./MedicalDataRegistry.abi.json")),
        network: "ganache-local",
        deployedAt: new Date().toISOString()
    };
    
    fs.writeFileSync("../../src/contracts/MedicalDataRegistry.json", JSON.stringify(deploymentInfo, null, 2));
    
    console.log("Deployment info saved to src/contracts/MedicalDataRegistry.json");
    
    return contract;
}

// Deploy and verify
async function main() {
    try {
        const contract = await deployMedicalDataRegistry();
        
        // Test deployment
        console.log("Testing contract deployment...");
        
        // Register a test patient
        const tx = await contract.registerPatient("Test Patient", "test@example.com");
        await tx.wait();
        
        console.log("Test patient registered successfully!");
        console.log("Contract is ready for use.");
        
    } catch (error) {
        console.error("Deployment failed:", error);
    }
}

if (require.main === module) {
    main();
}

module.exports = { deployMedicalDataRegistry };