import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import 'PoolManipulation.sol';


interface TheTokens is IERC20 {
  function mint(address to, uint256 amount) external;

  function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override;

  function approve(address spender, uint256 amount) public virtual override;
}

contract Initializer is PoolInitializer {


    INonfungiblePositionManager public immutable nonfungiblePositionManager =
        INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88); //pls help wtf does this do

    uint256 public _tokenId;

    constructor ()
                 PeripheryImmutableState(0x1F98431c8aD98523631AE4a`59f267346ea31F984,// UniswapV3 factory address
                                         0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 // WETH address
                 )
    {}

    function mintPosition(address token0, address token1, uint24 pool_fee) public returns (uint256 tokenId) {

        uint256 amount0ToMint = 100 * 10**18;
        uint256 amount1ToMint = 100 * 10**18;

        token0.transferFrom(msg.sender, address(this), amount0ToMint);
        token1.transferFrom(msg.sender, address(this), amount1ToMint);

        token0.approve(address(nonfungiblePositionManager), amount0ToMint);
        token1.approve(address(nonfungiblePositionManager), amount1ToMint);

        INonfungiblePositionManager.MintParams memory params =
            INonfungiblePositionManager.MintParams({
                token0: token0,
                token1: token1,
                fee: pool_fee,
                tickLower: TickMath.MIN_TICK,
                tickUpper: TickMath.MAX_TICK,
                amount0Desired: amount0ToMint,
                amount1Desired: amount1ToMint,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this),
                deadline: block.timestamp + 400
            });

        (tokenId, , , ) = nonfungiblePositionManager.mint(params);
        _tokenId = tokenId;
    }

   function getPosition()
        external
        view
        returns (
            uint96 nonce,
            address operator,
            address token0,
            address token1,
            uint24 fee,
            int24 tickLower,
            int24 tickUpper,
            uint128 liquidity,
            uint256 feeGrowthInside0LastX128,
            uint256 feeGrowthInside1LastX128,
            uint128 tokensOwed0,
            uint128 tokensOwed1
        )
    {
        return nonfungiblePositionManager.positions(_tokenId);

    }
}

contract LPFinal {

    TheTokens public synToken;
    TheTokens public weth; 

    uint24 private constant _pool_fee = 3000;
    uint256 private constant MAX_INT = 2**256 - 1;

    Initializer _initializer;

    address public liquidityPool;
    
    //constructs lp contract by taking in token address, initialiser and amounts. THis is called in the accept dep contract
    constructor(SyntheticToken _synToken, Initializer initializer, uint256 sytAmount, uint256 wethAmount) {
        synToken = _synToken;
        weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
        _initializer = initializer;

       //both token amounts are minted in AccDepContr

        //approval statement should be in the AccDepContr? tbh idk how this approval stuff works pls help
        synToken.approve(address(_initializer), MAX_INT);
        weth.approve(address(_initializer), MAX_INT); //not sure if we're allowed to do this? 

    }

    // create new pool

    function initializePool() public {

        address token0 = address(0);
        address token1 = address(0);

        if (address(synToken) < address(weth)) {
            token0 = address(synToken);
            token1 = address(weth);
        } else {
            token0 = address(weth);
            token1 = address(synToken);
        }

        uint160 initial_price = 2**96; // initial price of 1 ( need help figuring this out -- whats the base price?)

        liquidityPool = 
            _initializer.createAndInitializePoolIfNecessary(
                token0,
                token1,
                _pool_fee,
                initial_price
        );
    }

    // adding liquidity and other features from Non
    PoolManipulation public poolManipulator;

    //add liquidity







}

