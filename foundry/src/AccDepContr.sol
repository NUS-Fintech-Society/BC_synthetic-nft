// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./SytMintContr.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

interface IWETH is IERC20 {
    function deposit() external payable;
}

contract AccDepContr is ERC721Holder {
    IWETH weth;
    IUniswapV2Router02 router;

    struct PoolItem {
        address contractAddress;
        uint256 tokenId;
        address payable depositor;
        uint256 ethDep;
    }

    mapping(address => mapping(uint256 => PoolItem)) public listOfItems;
    mapping(address => bool) registry;
    address[] pools;

    constructor(address _weth, address _router) {
        weth = IWETH(_weth);
        router = IUniswapV2Router02(_router);
    }

    function depositFn(
        address contrAdd,
        uint256 tokenId,
        uint256 mintAmount
    ) public payable {
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

        // mint erc20 token
        SytMintContr synToken;
        synToken = new SytMintContr();
        synToken.mint(address(this), mintAmount);

        // create new LP
        synToken.approve(address(router), mintAmount);
        router.addLiquidityETH{value: msg.value}(
            address(synToken),
            mintAmount,
            mintAmount,
            msg.value,
            msg.sender,
            block.timestamp + 60
        );
    }

    function numPools() public view returns (uint256) {
        return pools.length;
    }

    function getPoolAtIndex(uint256 index) public view returns (address) {
        return pools[index];
    }
}
