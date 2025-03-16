// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Moments is Ownable {
    enum MomentStatus { Created, Pending, Complete }

    struct Participant {
        address wallet;
        bool signed;
    }

    struct Moment {
        address creator;
        string title;
        string description;
        string imageUrl;
        MomentStatus status;
        uint256 cost;
        bool isPublished;
        address[] publishTo;
        mapping(address => Participant) participants;
        address[] participantList;
    }

    mapping(uint256 => Moment) private moments;
    uint256 private momentCount;
    address private registryContract;

    event MomentCreated(uint256 indexed momentId, address indexed creator, string title);
    event MomentSigned(uint256 indexed momentId, address indexed participant);
    event MomentPublished(uint256 indexed momentId, bool isPublic, address[] recipients, uint256 cost);

    modifier onlyRegistry() {
        require(msg.sender == registryContract, "Unauthorized");
        _;
    }

    function setRegistryContract(address _registryContract) external onlyOwner {
        registryContract = _registryContract;
    }

    function createMoment(
        string memory title,
        string memory description,
        string memory imageUrl,
        address[] memory participants
    ) external {
        momentCount++;
        Moment storage moment = moments[momentCount];
        moment.creator = msg.sender;
        moment.title = title;
        moment.description = description;
        moment.imageUrl = imageUrl;
        moment.status = MomentStatus.Created;
        moment.isPublished = false;

        for (uint256 i = 0; i < participants.length; i++) {
            moment.participants[participants[i]] = Participant(participants[i], false);
            moment.participantList.push(participants[i]);
        }

        emit MomentCreated(momentCount, msg.sender, title);
    }

    function signMoment(uint256 momentId) external {
        Moment storage moment = moments[momentId];
        require(moment.participants[msg.sender].wallet != address(0), "Not a participant");
        require(!moment.participants[msg.sender].signed, "Already signed");

        moment.participants[msg.sender].signed = true;
        emit MomentSigned(momentId, msg.sender);

        bool allSigned = true;
        for (uint256 i = 0; i < moment.participantList.length; i++) {
            if (!moment.participants[moment.participantList[i]].signed) {
                allSigned = false;
                break;
            }
        }

        moment.status = allSigned ? MomentStatus.Complete : MomentStatus.Pending;
    }

    function publishMoment(uint256 momentId, address[] memory toWallets, uint256 cost) external onlyOwner {
        Moment storage moment = moments[momentId];
        require(moment.status == MomentStatus.Complete, "Moment not complete");
        require(!moment.isPublished, "Already published");

        moment.isPublished = true;
        moment.publishTo = toWallets;
        moment.cost = cost;

        if (toWallets.length == 0) {
            MomentRegistry(registryContract).addPublicMoment(momentId);
        } else {
            for (uint256 i = 0; i < toWallets.length; i++) {
                MomentRegistry(registryContract).addUserMoment(toWallets[i], momentId);
            }
        }

        emit MomentPublished(momentId, toWallets.length == 0, toWallets, cost);
    }

    function getMoment(uint256 momentId) external view returns (
        address creator,
        string memory title,
        string memory description,
        string memory imageUrl,
        MomentStatus status,
        bool isPublished,
        uint256 cost,
        address[] memory publishTo
    ) {
        Moment storage moment = moments[momentId];
        return (
            moment.creator,
            moment.title,
            moment.description,
            moment.imageUrl,
            moment.status,
            moment.isPublished,
            moment.cost,
            moment.publishTo
        );
    }

    function getParticipants(uint256 momentId) external view returns (address[] memory, bool[] memory) {
        Moment storage moment = moments[momentId];
        uint256 length = moment.participantList.length;
        bool[] memory signedStatus = new bool[](length);

        for (uint256 i = 0; i < length; i++) {
            signedStatus[i] = moment.participants[moment.participantList[i]].signed;
        }

        return (moment.participantList, signedStatus);
    }
}