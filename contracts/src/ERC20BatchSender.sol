// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ERC20BatchSender {
    error ERC20BatchSender__InvalidAddress();
    error ERC20BatchSender__ArraysLengthShouldBeSame();
    error ERC20BatchSender__TotalAmountMissMatched();
    error ERC20BatchSender__InsufficientAllowance();
    error ERC20BatchSender__InsufficientBalance();
    error ERC20BatchSender__TransferFailed();

    event Airdrop(address indexed sender, address[] recipients, uint256[] amounts, uint256 totalAmount);

    constructor() {}

    function airdropERC20Tokens(
        address tokenAddress,
        address[] calldata recipients,
        uint256[] calldata amounts,
        uint256 totalAmount
    ) external {
        if (tokenAddress == address(0)) revert ERC20BatchSender__InvalidAddress();
        if (recipients.length != amounts.length) revert ERC20BatchSender__ArraysLengthShouldBeSame();

        IERC20 token = IERC20(tokenAddress);

        uint256 tokenAllowance = token.allowance(msg.sender, address(this));
        if (totalAmount > tokenAllowance) revert ERC20BatchSender__InsufficientAllowance();

        if (totalAmount > token.balanceOf(msg.sender)) revert ERC20BatchSender__InsufficientBalance();

        uint256 expectedTotalAmount = 0;

        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == address(0)) revert ERC20BatchSender__InvalidAddress();
            expectedTotalAmount += amounts[i];
            bool success = token.transferFrom(msg.sender, recipients[i], amounts[i]);
            if (!success) revert ERC20BatchSender__TransferFailed();
        }

        if (totalAmount != expectedTotalAmount) revert ERC20BatchSender__TotalAmountMissMatched();

        emit Airdrop(msg.sender, recipients, amounts, totalAmount);
    }
}
