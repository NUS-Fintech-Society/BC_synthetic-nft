// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";



interface TheToken is IERC20 {
  function mint(address to, uint256 amount) external;
  
}

contract AccDepContr is ERC721Holder {

  TheToken public synToken;
  TheToken public weth;

  address lpAddress = 0xAB;
    
  struct PoolItem {
        address contractAddress;
        uint256 tokenId;
        address payable depositor;
        uint256 ethDep;
    }

  mapping(address => mapping(uint256 => PoolItem)) public listOfItems;
  mapping(address => bool) registry;
  address[] pools;


 
  constructor(TheToken _synToken) {
      synToken = _synToken;
      weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
  }

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

    function onERC721Received(
      address operator,
      address from,
      uint256 tokenId,
      bytes calldata data
  ) external override returns (bytes4) {
      return bytes4(keccak256("onERC721Received(operator, from, tokenId, data)"));
  }

   function numPools() public view returns (uint256) {
        return pools.length;
   }

  function expandedDepositFn(address contrAdd, uint256 tokenId, uint256 mintAmountSYT, uint256 mintAmountWETH) public payable {
    //require(msg.value > 0 , "");
    
    listOfItems[contrAdd][tokenId] =  PoolItem(
                                          contrAdd, 
                                          tokenId,   
                                          payable(msg.sender), 
                                          msg.value);

    IERC721(contrAdd).safeTransferFrom(msg.sender, address(this), tokenId);
    //mint erc20 token
    synToken.mint(lpAddress, mintAmountSYT);
    weth.transfer(msg.sender, lpAddress, mintAmountWETH);

    LPfinal(synToken, Initializer initializer, mintAmountSYT, mintAmountWETH);
    // take amount to mint as a parameter
  }


    function getPoolAtIndex(uint256 index) public view returns (address) {
        return pools[index];
    }
}
