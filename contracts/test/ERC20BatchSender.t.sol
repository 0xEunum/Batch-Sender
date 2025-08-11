// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ERC20BatchSenderScript, ERC20BatchSender} from "../script/ERC20BatchSender.s.sol";

contract ERC20BatchSenderTest is Test {
    ERC20BatchSenderScript deployer;
    ERC20BatchSender erc20;

    function setUp() public {
        deployer = new ERC20BatchSenderScript();
        erc20 = deployer.run();
    }
}
