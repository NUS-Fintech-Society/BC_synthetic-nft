// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "../src/NftTest.sol";

contract MyScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        NftTest nft = new NftTest();
        address deployer = vm.addr(deployerPrivateKey);
        nft.safeMint(deployer);

        vm.stopBroadcast();
    }
}
