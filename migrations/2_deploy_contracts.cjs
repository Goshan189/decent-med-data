const MedicalDataRegistry = artifacts.require("MedicalDataRegistry");

module.exports = function (deployer) {
  deployer.deploy(MedicalDataRegistry);
};