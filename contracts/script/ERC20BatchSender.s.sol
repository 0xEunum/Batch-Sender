// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {ERC20BatchSender} from "src/ERC20BatchSender.sol";

contract ERC20BatchSenderScript is Script {
    function run() public returns (ERC20BatchSender) {
        vm.startBroadcast();
        ERC20BatchSender ERC20Batchsender = new ERC20BatchSender();
        vm.stopBroadcast();
        return ERC20Batchsender;
    }
}
