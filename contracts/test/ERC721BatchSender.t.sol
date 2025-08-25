// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ERC721BatchSender} from "src/ERC721BatchSender.sol";
import {ERC721BatchSenderScript} from "../script/ERC721BatchSender.s.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

// Mock ERC721 contract for testing
contract MockERC721 is ERC721 {
    constructor(address initialOwner) ERC721("MockNFT", "MNFT") {
        for (uint256 i = 1; i <= 10; i++) {
            _mint(initialOwner, i);
        }
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}

// Mock receiver contract that rejects tokens
contract BadReceiver is IERC721Receiver {
    function onERC721Received(
        address, address, uint256, bytes calldata
    ) external pure override returns (bytes4) {
        return 0; // Invalid selector to reject tokens
    }
}

contract ERC721BatchSenderTest is Test {
    ERC721BatchSender batchSender;
    MockERC721 mockNFT;
    BadReceiver badReceiver;
    address owner = address(0x1);
    address recipient1 = address(0x2);
    address recipient2 = address(0x3);
    address recipient3 = address(0x4);

    function setUp() public {
        vm.startPrank(owner);
        mockNFT = new MockERC721(owner);
        badReceiver = new BadReceiver();
        batchSender = new ERC721BatchSender();
        vm.stopPrank();
    }

    function testDeployWithScript() public {
        ERC721BatchSenderScript script = new ERC721BatchSenderScript();
        ERC721BatchSender deployed = script.run();
        assertTrue(address(deployed) != address(0), "Deployment failed");
    }

    function testBatchTransfer() public {
        vm.startPrank(owner);
        
        address[] memory recipients = new address[](3);
        recipients[0] = recipient1;
        recipients[1] = recipient2;
        recipients[2] = recipient3;
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = 1;
        tokenIds[1] = 2;
        tokenIds[2] = 3;

        mockNFT.setApprovalForAll(address(batchSender), true);
        
        vm.expectEmit(true, true, true, true);
        emit ERC721BatchSender.BatchTransfer(owner, address(mockNFT), recipients, tokenIds);
        
        batchSender.batchTransferERC721(address(mockNFT), recipients, tokenIds);

        assertEq(mockNFT.ownerOf(1), recipient1);
        assertEq(mockNFT.ownerOf(2), recipient2);
        assertEq(mockNFT.ownerOf(3), recipient3);
        
        vm.stopPrank();
    }

    function test_RevertWhen_InvalidTokenAddress() public {
        vm.startPrank(owner);
        
        address[] memory recipients = new address[](1);
        recipients[0] = recipient1;
        
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = 1;

        vm.expectRevert(ERC721BatchSender.ERC721BatchSender__InvalidAddress.selector);
        batchSender.batchTransferERC721(address(0), recipients, tokenIds);
        
        vm.stopPrank();
    }

    function test_RevertWhen_ArrayMismatch() public {
        vm.startPrank(owner);
        
        address[] memory recipients = new address[](2);
        recipients[0] = recipient1;
        recipients[1] = recipient2;
        
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = 1;

        mockNFT.setApprovalForAll(address(batchSender), true);
        vm.expectRevert(ERC721BatchSender.ERC721BatchSender__ArraysLengthShouldBeSame.selector);
        batchSender.batchTransferERC721(address(mockNFT), recipients, tokenIds);
        
        vm.stopPrank();
    }

    function test_RevertWhen_EmptyArrays() public {
        vm.startPrank(owner);
        
        address[] memory recipients = new address[](0);
        uint256[] memory tokenIds = new uint256[](0);

        mockNFT.setApprovalForAll(address(batchSender), true);
        vm.expectRevert(ERC721BatchSender.ERC721BatchSender__ArraysLengthShouldBeSame.selector);
        batchSender.batchTransferERC721(address(mockNFT), recipients, tokenIds);
        
        vm.stopPrank();
    }

    function test_RevertWhen_InvalidRecipient() public {
        vm.startPrank(owner);
        
        address[] memory recipients = new address[](1);
        recipients[0] = address(0);
        
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = 1;

        mockNFT.setApprovalForAll(address(batchSender), true);
        vm.expectRevert(ERC721BatchSender.ERC721BatchSender__InvalidAddress.selector);
        batchSender.batchTransferERC721(address(mockNFT), recipients, tokenIds);
        
        vm.stopPrank();
    }

    function test_RevertWhen_NotOwner() public {
        vm.startPrank(address(0x5));
        
        address[] memory recipients = new address[](1);
        recipients[0] = recipient1;
        
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = 1;

        vm.expectRevert(ERC721BatchSender.ERC721BatchSender__NotOwnerOrApproved.selector);
        batchSender.batchTransferERC721(address(mockNFT), recipients, tokenIds);
        
        vm.stopPrank();
    }

    function test_RevertWhen_NoApproval() public {
        vm.startPrank(owner);
        
        address[] memory recipients = new address[](1);
        recipients[0] = recipient1;
        
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = 1;

        vm.expectRevert(ERC721BatchSender.ERC721BatchSender__NotOwnerOrApproved.selector);
        batchSender.batchTransferERC721(address(mockNFT), recipients, tokenIds);
        
        vm.stopPrank();
    }

    function test_RevertWhen_SameTokenTwice() public {
    vm.startPrank(owner);
    
    address[] memory recipients = new address[](2);
    recipients[0] = recipient1;
    recipients[1] = recipient2;
    
    uint256[] memory tokenIds = new uint256[](2);
    tokenIds[0] = 1;
    tokenIds[1] = 1; // Same token ID

    mockNFT.setApprovalForAll(address(batchSender), true);
    vm.expectRevert(ERC721BatchSender.ERC721BatchSender__TransferFailed.selector);
    batchSender.batchTransferERC721(address(mockNFT), recipients, tokenIds);
    
    vm.stopPrank();
}

    function test_RevertWhen_TransferToBadReceiver() public {
        vm.startPrank(owner);
        
        address[] memory recipients = new address[](1);
        recipients[0] = address(badReceiver);
        
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = 1;

        mockNFT.setApprovalForAll(address(batchSender), true);
        vm.expectRevert(ERC721BatchSender.ERC721BatchSender__TransferFailed.selector);
        batchSender.batchTransferERC721(address(mockNFT), recipients, tokenIds);
        
        vm.stopPrank();
    }
}