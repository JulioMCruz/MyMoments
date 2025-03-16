// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MomentRegistry is Ownable {
    uint256[] private publicMoments;
    mapping(address => uint256[]) private userMoments;

    event PublicMomentAdded(uint256 indexed momentId);
    event UserMomentAdded(address indexed user, uint256 indexed momentId);

    function addPublicMoment(uint256 momentId) external onlyOwner {
        publicMoments.push(momentId);
        emit PublicMomentAdded(momentId);
    }

    function addUserMoment(address user, uint256 momentId) external onlyOwner {
        userMoments[user].push(momentId);
        emit UserMomentAdded(user, momentId);
    }

    function getPublicMoments() external view returns (uint256[] memory) {
        return publicMoments;
    }

    function getUserMoments(address user) external view returns (uint256[] memory) {
        return userMoments[user];
    }
}