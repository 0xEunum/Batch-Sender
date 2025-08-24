// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ERC721BatchSender is ReentrancyGuard {
    error ERC721BatchSender__InvalidAddress();
    error ERC721BatchSender__ArraysLengthShouldBeSame();
    error ERC721BatchSender__NotOwnerOrApproved();
    error ERC721BatchSender__TransferFailed();
    error ERC721BatchSender__TooManyTransfers();

    event BatchTransfer(
        address indexed sender, 
        address indexed tokenAddress,
        address[] recipients, 
        uint256[] tokenIds
    );

    constructor() {}

    /**
     * @dev Batch transfer ERC721 tokens to multiple recipients
     * @param tokenAddress Address of the ERC721 contract
     * @param recipients Array of recipient addresses
     * @param tokenIds Array of token IDs to transfer
     */
    function batchTransferERC721(
        address tokenAddress,
        address[] calldata recipients,
        uint256[] calldata tokenIds
    ) 
        external 
        nonReentrant 
    {
        if (tokenAddress == address(0)) revert ERC721BatchSender__InvalidAddress();
        if (recipients.length != tokenIds.length) revert ERC721BatchSender__ArraysLengthShouldBeSame();
        if (recipients.length == 0) revert ERC721BatchSender__ArraysLengthShouldBeSame();

        IERC721 token = IERC721(tokenAddress);

        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == address(0)) revert ERC721BatchSender__InvalidAddress();
            if (token.ownerOf(tokenIds[i]) != msg.sender) revert ERC721BatchSender__NotOwnerOrApproved();
            if (!token.isApprovedForAll(msg.sender, address(this)) && 
                token.getApproved(tokenIds[i]) != address(this)) {
                revert ERC721BatchSender__NotOwnerOrApproved();
            }
        }

        for (uint256 i = 0; i < recipients.length; i++) {
            try token.safeTransferFrom(msg.sender, recipients[i], tokenIds[i]) {
            } catch {
                revert ERC721BatchSender__TransferFailed();
            }
        }

        emit BatchTransfer(msg.sender, tokenAddress, recipients, tokenIds);
    }
}