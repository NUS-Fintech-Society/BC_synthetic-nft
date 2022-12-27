// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract AccDepContr is ERC721Holder {
    struct PoolItem {
        address contractAddress;
        uint256 tokenId;
        address payable depositor;
        uint256 ethDep;
    }

    mapping(address => bool) registry;
    address[] pools;
    mapping(address => mapping(uint256 => PoolItem)) public listOfItems;

    constructor() {}

    function depositFn(address contrAdd, uint256 tokenId) public payable {
        require(msg.value > 0, "no eth deposit");
        require(registry[contrAdd] == false, "pool already created");

        registry[contrAdd] = true;
        pools.push(contrAdd);
        listOfItems[contrAdd][tokenId] = PoolItem(
            contrAdd,
            tokenId,
            payable(msg.sender),
            msg.value
        );

        IERC721(contrAdd).safeTransferFrom(msg.sender, address(this), tokenId);
        //mint erc20 token
        // take amount to mint as a parameter
    }

    function numPools() public view returns (uint256) {
        return pools.length;
    }

    function getPoolAtIndex(uint256 index) public view returns (address) {
        return pools[index];
    }
}
