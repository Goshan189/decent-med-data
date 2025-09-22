const MedicalDataRegistry = artifacts.require("MedicalDataRegistry");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(MedicalDataRegistry);
  const registry = await MedicalDataRegistry.deployed();

  // First 5 accounts as patients
  for (let i = 0; i < 5; i++) {
    await registry.setRole(accounts[i], 1); // 1 = Patient
  }
  // Last 5 accounts as researchers
  for (let i = 5; i < 10; i++) {
    await registry.setRole(accounts[i], 2); // 2 = Researcher
  }
};