import { useState } from "react";
import type { NextPage } from "next";
import { useAccount, useContractRead, useContractReads } from "wagmi";
import { Layout, PositionCard } from "../components";
import { Grid, Loading } from "@nextui-org/react";
import nftDeployment from "../foundry/broadcast/NftTest.s.sol/1/run-latest.json";
import { BigNumber } from "ethers";

const Positions: NextPage = () => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const { address, isConnecting: accountLoading } = useAccount();
  const nftAddress = nftDeployment.transactions[0]
    .contractAddress as `0x${string}`;

  const { data: nftBalance } = useContractRead({
    address: nftAddress,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
      },
    ],
    functionName: "balanceOf",
    args: [address || "0x"],
    watch: true,
  });

  const tokens = [];
  if (nftBalance) {
    for (let index = 0; index < nftBalance.toNumber(); index++) {
      tokens.push({
        address: nftAddress,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "index",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
            name: "tokenOfOwnerByIndex",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
          },
        ],
        functionName: "tokenOfOwnerByIndex",
        args: [address || "0x", BigNumber.from(index.toString())],
      });
    }
  }
  const { data: nftsData, isLoading: nftLoading } = useContractReads({
    enabled: tokens.length > 0,
    contracts: tokens,
  });
  const nfts = nftsData as BigNumber[];
  const loading = accountLoading || nftLoading;

  return (
    <>
      <Layout
        showWalletOptions={showWalletOptions}
        setShowWalletOptions={setShowWalletOptions}
      >
        <div className="md:mt-40 md:px-20">
          {loading ? (
            <Loading type="points" color="currentColor" size="sm" />
          ) : (
            <Grid.Container gap={2}>
              {nfts?.map((nft, index) => {
                if (!nft) return;
                return (
                  <Grid xs={6} md={3} key={index}>
                    <PositionCard
                      userAddress={address || "0x"}
                      nftAddress={nftAddress}
                      tokenId={nft.toNumber()}
                    />
                  </Grid>
                );
              })}
            </Grid.Container>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Positions;
