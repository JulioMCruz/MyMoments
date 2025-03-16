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
        address[] publishTo;
        mapping(address => Participant) participants;
        address[] participantList;
        bool isPublished;
    }

    mapping(uint256 => Moment) private moments;
    uint256 private momentCount;

    event MomentCreated(uint256 indexed momentId, address indexed creator, string title);
    event MomentSigned(uint256 indexed momentId, address indexed participant);
    event MomentPublished(uint256 indexed momentId, address[] recipients, uint256 cost);

    /**
     * @dev Creates a new moment.
     * @param title The title of the moment.
     * @param description The description of the moment.
     * @param imageUrl The image URL of the moment.
     * @param participants The list of participant wallet addresses.
     */
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

    /**
     * @dev Allows a participant to sign the moment.
     * @param momentId The ID of the moment.
     */
    function signMoment(uint256 momentId) external {
        Moment storage moment = moments[momentId];
        require(moment.participants[msg.sender].wallet != address(0), "Not a participant");
        require(!moment.participants[msg.sender].signed, "Already signed");

        moment.participants[msg.sender].signed = true;
        emit MomentSigned(momentId, msg.sender);

        // Check if all participants signed
        bool allSigned = true;
        for (uint256 i = 0; i < moment.participantList.length; i++) {
            if (!moment.participants[moment.participantList[i]].signed) {
                allSigned = false;
                break;
            }
        }

        // Update status if complete
        if (allSigned) {
            moment.status = MomentStatus.Complete;
        } else {
            moment.status = MomentStatus.Pending;
        }
    }

    /**
     * @dev Publishes a moment.
     * @param momentId The ID of the moment.
     * @param toWallets The list of wallet addresses to publish to (empty for public).
     * @param cost The cost to mint (0 for free).
     */
    function publishMoment(uint256 momentId, address[] memory toWallets, uint256 cost) external onlyOwner {
        Moment storage moment = moments[momentId];
        require(moment.status == MomentStatus.Complete, "Moment not complete");
        require(!moment.isPublished, "Already published");

        moment.isPublished = true;
        moment.publishTo = toWallets;
        moment.cost = cost;

        emit MomentPublished(momentId, toWallets, cost);
    }

    /**
     * @dev Retrieves moment details.
     * @param momentId The ID of the moment.
     */
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

    /**
     * @dev Retrieves participant status.
     * @param momentId The ID of the moment.
     */
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