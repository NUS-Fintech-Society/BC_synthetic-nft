// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract acc_dep_contr is IERC721Receiver {
    
    struct pool_item {
      address contract_address;
      uint256 tokenId;
      address payable depositor;
      uint256 eth_dep;
    }

    mapping(address => mapping(uint256 => pool_item)) private list_of_items;

    constructor(){ 
    }

    IERC721 public parentContract;

    function deposit_fn(address contr_add, uint256 tokenId) public payable {
      //require(msg.value > 0 , "");
      parentContract = IERC721(contr_add);
      list_of_items[contr_add][tokenId] =  pool_item(
                                            contr_add, 
                                            tokenId, 
                                            payable(msg.sender), 
                                            msg.value);

      parentContract.safeTransferFrom(msg.sender, address(this), tokenId);

      payable(address(this)).transfer(msg.value);

      //mint erc20 token
      // take amount to mint as a parameter
    }

     function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        return bytes4(keccak256("onERC721Received(operator, from, tokenId, data)"));
    }


}
