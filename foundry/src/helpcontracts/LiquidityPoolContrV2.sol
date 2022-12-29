pragma solidity 0.5.16;

import "@uniswap/v2-core/contracts/UniswapV2Pair.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// This contract represents the liquidity pool
contract LiquidityPool {
    using SafeMath for uint256;

    // Mapping from user to their NFT token ID
    mapping(address => uint256) public userToNFT;

    // Mapping from user to their synthetic token balance
    mapping(address => uint256) public balanceOf;

    // The Uniswap V3 pair for the native currency and synthetic tokens
    IUniswapV3Pair pair;

    // The initial price for the synthetic tokens in native currency
    uint256 initialPrice;

    // The contract owner can set the Uniswap V3 pair and initial price
    constructor(IUniswapV3Pair _pair, uint256 _initialPrice) public {
        pair = _pair;
        initialPrice = _initialPrice;
    }

    // Allows users to add liquidity to the pool by depositing native currency and their NFT
    function addLiquidity(uint256 _nativeCurrencyAmount, uint256 _nftTokenID) public {
        // Verify that the caller owns the NFT
        require(userToNFT[msg.sender] == _nftTokenID, "Caller does not own the NFT");

        // Mint synthetic tokens based on the initial price
        uint256 syntheticTokenAmount = _nativeCurrencyAmount.mul(initialPrice);
        pair.mint(syntheticTokenAmount);

        // Update the user's synthetic token balance
        balanceOf[msg.sender] = balanceOf[msg.sender].add(syntheticTokenAmount);

        // Update the mapping from user to NFT token ID
        userToNFT[msg.sender] = _nftTokenID;
    }

    // Allows users to remove liquidity from the pool by providing their Uniswap V3 position and original NFT
    function removeLiquidity(uint256 _positionID, uint256 _nftTokenID) public {
        // Verify that the caller owns the position
        require(pair.balanceOf(_positionID) > 0, "Caller does not own the position");

        // Verify that the caller owns the NFT
        require(userToNFT[msg.sender] == _nftTokenID, "Caller does not own the NFT");

        // Burn the synthetic tokens in the position
        uint256 syntheticTokenAmount = pair.balanceOf(_positionID);
        pair.burn(syntheticTokenAmount, _positionID);

        // Update the user's synthetic token balance
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(syntheticTokenAmount);

        // Remove the mapping from user to NFT token ID
        delete userToNFT[msg.sender];
    }
        // Allows users to trade synthetic tokens on Uniswap
    function trade(uint256 _syntheticTokenAmount) public {
        // Verify that the caller has enough synthetic tokens to trade
        require(balanceOf[msg.sender] >= _syntheticTokenAmount, "Not enough synthetic tokens to trade");

        // Transfer the synthetic tokens to Uniswap
        pair.transfer(msg.sender, _syntheticTokenAmount);

        // Update the user's synthetic token balance
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_syntheticTokenAmount);
    }
}