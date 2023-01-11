import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { Button, Loading } from "@nextui-org/react";
import managerDeployment from "../../foundry/broadcast/AccDepContr.s.sol/1/run-latest.json";

interface Props {
  nftAddress: `0x${string}`;
}

export default function ApproveNftButton(props: Props) {
  const { nftAddress } = props;
  const managerAddress = managerDeployment.transactions[0]
    .contractAddress as `0x${string}`;

  const { config } = usePrepareContractWrite({
    address: nftAddress,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "setApprovalForAll",
    args: [managerAddress, true],
  });
  const { isLoading, write } = useContractWrite(config);

  return (
    <Button disabled={isLoading} size="lg" onPress={() => write?.()}>
      {isLoading ? (
        <Loading type="points" color="currentColor" size="lg" />
      ) : (
        "Approve NFT"
      )}
    </Button>
  );
}
