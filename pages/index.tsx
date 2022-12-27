import { useState } from "react";
import type { NextPage } from "next";
import { useContractRead, useContractReads } from "wagmi";
import { Layout } from "../components";
import { Grid, Loading } from "@nextui-org/react";
import PoolCard from "../components/PoolCard";
import managerDeployment from "../foundry/broadcast/AccDepContr.s.sol/31337/run-latest.json";
import { BigNumber } from "ethers";

const Home: NextPage = () => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const managerAddress = managerDeployment.transactions[0]
    .contractAddress as `0x${string}`;

  const { data: numPools } = useContractRead({
    address: managerAddress,
    abi: [
      {
        inputs: [],
        name: "numPools",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "numPools",
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
                internalType: "uint256",
                name: "index",
                type: "uint256",
              },
            ],
            name: "getPoolAtIndex",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "getPoolAtIndex",
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
      <div className="md:mt-40 md:px-20">
        {poolsLoading ? (
          <Loading type="points" size="sm" />
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
    </Layout>
  );
};

export default Home;
