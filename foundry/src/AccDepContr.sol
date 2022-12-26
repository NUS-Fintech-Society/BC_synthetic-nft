// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract AccDepContr is IERC721Receiver {
    struct PoolItem {
        address contractAddress;
        uint256 tokenId;
        address payable depositor;
        uint256 ethDep;
    }

    mapping(address => mapping(uint256 => PoolItem)) public listOfItems;

    constructor() {}

    function depositFn(address contrAdd, uint256 tokenId) public payable {
        //require(msg.value > 0 , "");

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

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return
            bytes4(
                keccak256("onERC721Received(operator, from, tokenId, data)")
            );
    }
}
