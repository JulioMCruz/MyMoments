// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MomentsUserRegistry is Ownable {
    struct User {
        address wallet;
        bool isVerified;
    }

    mapping(bytes32 => User) private users;

    event UserRegistered(bytes32 indexed userId, address indexed wallet);
    event UserVerified(bytes32 indexed userId, bool isVerified);

    /**
     * @dev Registers a new user.
     * @param userId The UUID of the user.
     * @param wallet The wallet address of the user.
     */
    function registerUser(bytes32 userId, address wallet) external onlyOwner {
        require(users[userId].wallet == address(0), "User already exists");
        users[userId] = User(wallet, false);
        emit UserRegistered(userId, wallet);
    }

    /**
     * @dev Checks if a user is registered.
     * @param userId The UUID of the user.
     * @return bool Returns true if user exists, false otherwise.
     */
    function isUserRegistered(bytes32 userId) external view returns (bool) {
        return users[userId].wallet != address(0);
    }

    /**
     * @dev Updates a user's verification status.
     * @param userId The UUID of the user.
     */
    function verifyUser(bytes32 userId) external onlyOwner {
        require(users[userId].wallet != address(0), "User does not exist");
        users[userId].isVerified = true;
        emit UserVerified(userId, true);
    }
}