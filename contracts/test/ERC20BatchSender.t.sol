// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ERC20BatchSenderScript, ERC20BatchSender} from "../script/ERC20BatchSender.s.sol";

contract ERC20BatchSenderTest is Test {
    ERC20BatchSender erc20;

    function setUp() public {
        erc20 = new ERC20BatchSenderScript();
    }
}
