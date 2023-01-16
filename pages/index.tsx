import { useState } from 'react';
import type { NextPage } from 'next';
import { useContractRead, useContractReads, useAccount } from 'wagmi';
import { DepositModal, Layout } from '../components';
import { Grid, Loading } from '@nextui-org/react';
import PoolCard from '../components/PoolCard';
import managerDeployment from '../foundry/broadcast/AccDepContr.s.sol/1/run-latest.json';
import { BigNumber } from 'ethers';

const Home: NextPage = () => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const managerAddress = managerDeployment.transactions[0]
    .contractAddress as `0x${string}`;
  const [openModal, setOpenModal] = useState(false);
  const { address, isConnecting, isDisconnected } = useAccount();

  const { data: numPools } = useContractRead({
    address: managerAddress,
    abi: [
      {
        inputs: [],
        name: 'numPools',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'numPools',
    watch: true,
  });

  const pools = [];
  if (numPools) {
    for (let index = 0; index < numPools.toNumber(); index++) {
      pools.push({
        address: managerAddress,
        abi: [
          {
            inputs: [
              {
                internalType: 'uint256',
                name: 'index',
                type: 'uint256',
              },
            ],
            name: 'getPoolAtIndex',
            outputs: [
              {
                internalType: 'address',
                name: '',
                type: 'address',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'getPoolAtIndex',
        args: [BigNumber.from(index.toString())],
      });
    }
  }

  const { data: poolsData, isLoading: poolsLoading } = useContractReads({
    enabled: pools.length > 0,
    contracts: pools,
  });

  return (
    <Layout
      showWalletOptions={showWalletOptions}
      setShowWalletOptions={setShowWalletOptions}
    >
      <div className='flex flex-row justify-center'>
        {/* <DepositModal
          open={openModal}
          setOpen={setOpenModal}
          userAddress={isConnecting ? '0x' : (address as '0x${string}')}
          nftAddress={'0x398E4948e373Db819606A459456176D31C3B1F91'}
          tokenId={0}
        /> */}
        {/* <button
          onClick={() => setOpenModal(!openModal)}
          className='border-2 border-indigo-300 p-4 rounded-md h-14'
        >
          Deposit NFT!
        </button> */}
        <div className='flex flex-col ml-48'>
          <div className='flex'>
            <img
              src='https://imageio.forbes.com/specials-images/imageserve/631fd33431b0b6a8ed7ec50a/series-of-Doodles-NFTs-/960x0.jpg?format=jpg&width=960 '
              alt=''
              className='w-1/2 rounded-sm '
            />
            <img
              src='https://media.smallbiztrends.com/2022/01/Most-Popular-NFT-Collections.png'
              className='w-1/2 rounded-sm'
            />
          </div>
          <img
            src='https://imageio.forbes.com/specials-images/imageserve/620a72c14f04534b752b0ac7/0x0.jpg?format=jpg&width=1200'
            className='w-full rounded-sm'
          />
        </div>
        <div className='md:mt-40 md:px-20'>
          {poolsLoading ? (
            <Loading type='points' size='sm' />
          ) : (
            <Grid.Container gap={2}>
              {poolsData?.map((pool, index) => {
                return (
                  <Grid xs={6} md={3} key={index}>
                    <PoolCard />
                  </Grid>
                );
              })}
            </Grid.Container>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
