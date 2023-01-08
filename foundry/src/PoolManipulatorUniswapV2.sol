// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../lib/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "../lib/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "../lib/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "../lib/v2-periphery/contracts/interfaces/IWETH.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PoolManipulatorUniswapV2 {

    address private constant factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private constant wethAddress = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address private constant router02 = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    
    IUniswapV2Router02 _router = IUniswapV2Router02(router02);
    IUniswapV2Factory _factory = IUniswapV2Factory(factory);
    
    uint256 minAmountSyt = 1;
    uint256 minAmountWeth = 1; 
    address currentPair;

    constructor (){
    }

    // creates new trading pair between synthetic token (input) and weth
    function createPair(address syt) internal returns (address) {
        address pair = _factory.createPair(syt, wethAddress);
        return (pair);
    }

    //obtains syt address from trading pair
    function obtainTokenAddress (address pair) internal view returns (address) {

        if ( IUniswapV2Pair(pair).token0() == wethAddress) {
            return ( IUniswapV2Pair(pair).token1() );
        } else {
            return ( IUniswapV2Pair(pair).token0() );
        }

    }

    //intial function to obtain and store current trading pair
    function initialise(address syt) external {

        //obtain address of pair
        currentPair = _factory.getPair(syt, wethAddress);

        // create the pair if it doesn't exist yet
        if (currentPair == address(0)) {
            currentPair = createPair(syt);
        } 

    }

    //accepts synthetic token & eth; adds liquidity to syt-weth pool 
    function _addLiqudity (uint _amountSyt) external payable returns (uint256, uint256, uint256) {

        address syt = obtainTokenAddress(currentPair);

        // convert ETH to WETH
        IWETH(wethAddress).deposit{value: msg.value}();
        uint256 currentWeth = IERC20(wethAddress).balanceOf(address(this));

        //transfers syt from sender to current contract; approves router02 to handle syt
        IERC20(syt).transferFrom(msg.sender, address(this), _amountSyt);
        IERC20(syt).approve(router02, _amountSyt);

        //calls add liquidity function in UniswapV2router contract
        (uint amountSyt, uint amountWeth, uint liquidity) = _router.addLiquidity(
                                                                        syt, 
                                                                        wethAddress, 
                                                                        _amountSyt, 
                                                                        currentWeth, 
                                                                        minAmountSyt, 
                                                                        minAmountWeth, 
                                                                        address(this), 
                                                                        block.timestamp
                                                                        );

        return (amountSyt, amountWeth, liquidity);

    }

    //removes liquidity from trading pair
    function _removeLiquidity() external returns (uint256, uint256) {

        address syt =  obtainTokenAddress(currentPair);

        //obtains liquidity balance, approves router to transact
        uint liquidity = IERC20(currentPair).balanceOf(address(this));
        IERC20(currentPair).approve(router02, liquidity);

        //calls removeLiquidity function from UniswapV2Router contract
        (uint amountSyt, uint weth) = _router.removeLiquidity(
                                                        syt,
                                                        wethAddress,
                                                        liquidity,
                                                        1,
                                                        1,
                                                        address(this),
                                                        block.timestamp
                                                    );

        return (amountSyt, weth);

    }

}