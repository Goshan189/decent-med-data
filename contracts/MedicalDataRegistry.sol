// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MedicalDataRegistry {
    enum Role {
        None,
        Patient,
        Researcher
    }
    mapping(address => Role) public userRoles;

    struct MedicalData {
        string ipfsHash;
        string patientName;
        string dataType;
        uint256 timestamp;
        address owner;
        bool isPublic;
        uint256 price;
        bool exists;
    }

    struct Patient {
        string name;
        string email;
        address walletAddress;
        bool isRegistered;
    }

    mapping(bytes32 => MedicalData) public medicalDataRegistry;
    mapping(address => Patient) public patients;
    mapping(address => bytes32[]) public patientDataHashes;
    mapping(bytes32 => address[]) public dataAccessors;

    bytes32[] public allDataHashes;
    address[] public allPatients;

    event DataRegistered(
        bytes32 indexed dataHash,
        address indexed owner,
        string ipfsHash
    );
    event DataPurchased(
        bytes32 indexed dataHash,
        address indexed buyer,
        uint256 price
    );
    event PatientRegistered(address indexed patient, string name);
    event DataMadePublic(bytes32 indexed dataHash, uint256 price);

    modifier onlyOwner(bytes32 dataHash) {
        require(
            medicalDataRegistry[dataHash].owner == msg.sender,
            "Not the data owner"
        );
        _;
    }

    modifier dataExists(bytes32 dataHash) {
        require(medicalDataRegistry[dataHash].exists, "Data does not exist");
        _;
    }

    function registerPatient(string memory _name, string memory _email) public {
        require(
            !patients[msg.sender].isRegistered,
            "Patient already registered"
        );

        patients[msg.sender] = Patient({
            name: _name,
            email: _email,
            walletAddress: msg.sender,
            isRegistered: true
        });

        allPatients.push(msg.sender);
        emit PatientRegistered(msg.sender, _name);
    }

    function registerMedicalData(
        string memory _ipfsHash,
        string memory _patientName,
        string memory _dataType
    ) public returns (bytes32) {
        require(patients[msg.sender].isRegistered, "Patient not registered");

        bytes32 dataHash = keccak256(
            abi.encodePacked(_ipfsHash, msg.sender, block.timestamp)
        );

        require(
            !medicalDataRegistry[dataHash].exists,
            "Data already registered"
        );

        medicalDataRegistry[dataHash] = MedicalData({
            ipfsHash: _ipfsHash,
            patientName: _patientName,
            dataType: _dataType,
            timestamp: block.timestamp,
            owner: msg.sender,
            isPublic: false,
            price: 0,
            exists: true
        });

        patientDataHashes[msg.sender].push(dataHash);
        allDataHashes.push(dataHash);

        emit DataRegistered(dataHash, msg.sender, _ipfsHash);
        return dataHash;
    }

    function makeDataPublic(
        bytes32 _dataHash,
        uint256 _price
    ) public onlyOwner(_dataHash) dataExists(_dataHash) {
        medicalDataRegistry[_dataHash].isPublic = true;
        medicalDataRegistry[_dataHash].price = _price;

        emit DataMadePublic(_dataHash, _price);
    }

    function purchaseDataAccess(
        bytes32 _dataHash
    ) public payable dataExists(_dataHash) {
        MedicalData memory data = medicalDataRegistry[_dataHash];
        require(data.isPublic, "Data is not public");
        require(msg.value >= data.price, "Insufficient payment");
        require(data.owner != msg.sender, "Cannot purchase your own data");

        // Transfer payment to data owner
        payable(data.owner).transfer(msg.value);

        // Grant access
        dataAccessors[_dataHash].push(msg.sender);

        emit DataPurchased(_dataHash, msg.sender, msg.value);
    }

    function verifyDataIntegrity(
        bytes32 _dataHash
    )
        public
        view
        dataExists(_dataHash)
        returns (bool, string memory, address, uint256)
    {
        MedicalData memory data = medicalDataRegistry[_dataHash];
        return (true, data.ipfsHash, data.owner, data.timestamp);
    }

    function getPublicDataList() public view returns (bytes32[] memory) {
        bytes32[] memory publicData = new bytes32[](allDataHashes.length);
        uint256 publicCount = 0;

        for (uint256 i = 0; i < allDataHashes.length; i++) {
            if (medicalDataRegistry[allDataHashes[i]].isPublic) {
                publicData[publicCount] = allDataHashes[i];
                publicCount++;
            }
        }

        // Resize array to actual count
        bytes32[] memory result = new bytes32[](publicCount);
        for (uint256 i = 0; i < publicCount; i++) {
            result[i] = publicData[i];
        }

        return result;
    }

    function getPatientData(
        address _patient
    ) public view returns (bytes32[] memory) {
        return patientDataHashes[_patient];
    }

    function hasAccessToData(
        bytes32 _dataHash,
        address _user
    ) public view returns (bool) {
        if (medicalDataRegistry[_dataHash].owner == _user) {
            return true;
        }

        address[] memory accessors = dataAccessors[_dataHash];
        for (uint256 i = 0; i < accessors.length; i++) {
            if (accessors[i] == _user) {
                return true;
            }
        }

        return false;
    }

    function getMedicalData(
        bytes32 _dataHash
    )
        public
        view
        dataExists(_dataHash)
        returns (
            string memory ipfsHash,
            string memory patientName,
            string memory dataType,
            uint256 timestamp,
            address owner,
            bool isPublic,
            uint256 price
        )
    {
        MedicalData memory data = medicalDataRegistry[_dataHash];
        return (
            data.ipfsHash,
            data.patientName,
            data.dataType,
            data.timestamp,
            data.owner,
            data.isPublic,
            data.price
        );
    }

    function setRole(address user, Role role) public {
        userRoles[user] = role;
    }

    function getRole(address user) public view returns (Role) {
        return userRoles[user];
    }
}
