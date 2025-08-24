// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {ERC721BatchSender} from "src/ERC721BatchSender.sol";

contract ERC721BatchSenderScript is Script {
    function run() public returns (ERC721BatchSender) {
        vm.startBroadcast();
        ERC721BatchSender batchSender = new ERC721BatchSender();
        vm.stopBroadcast();
        return batchSender;
    }
}