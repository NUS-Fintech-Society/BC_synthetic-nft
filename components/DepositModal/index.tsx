import { useEffect, useState } from "react";
import {
  useBalance,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  Modal,
  Text,
  Input,
  Loading,
  Button,
  useInput,
} from "@nextui-org/react";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import managerDeployment from "../../foundry/broadcast/AccDepContr.s.sol/1/run-latest.json";
import { BigNumber } from "ethers";
import ApproveNftButton from "./ApproveNftButton";

interface Props {
  open: boolean;
  setOpen: (showWalletOptions: boolean) => void;
  userAddress: `0x${string}`;
  nftAddress: `0x${string}`;
  tokenId: number;
}

export default function DepositModal(props: Props) {
  const { open, setOpen, nftAddress, tokenId, userAddress } = props;
  const [error, setError] = useState();
  const [valid, setValid] = useState(false);
  const { value, bindings } = useInput("");
  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address: userAddress,
    watch: true,
  });
  const managerAddress = managerDeployment.transactions[0]
    .contractAddress as `0x${string}`;

  const { data: nftApproved } = useContractRead({
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
            internalType: "address",
            name: "operator",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
        name: "isApprovedForAll",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
      },
    ],
    functionName: "isApprovedForAll",
    args: [userAddress, managerAddress],
    watch: true,
  });

  const { config } = usePrepareContractWrite({
    enabled: nftApproved && parseFloat(value) > 0,
    address: managerAddress,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "contrAdd",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "mintAmount",
            type: "uint256",
          },
        ],
        name: "depositFn",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    functionName: "depositFn",
    args: [nftAddress, BigNumber.from(tokenId), parseEther("100")],
    overrides: {
      value: value != "" ? parseEther(value) : parseEther("0"),
    },
  });
  const {
    data,
    isLoading: depositLoading,
    isSuccess,
    write,
  } = useContractWrite(config);

  const userBalance = balanceData
    ? parseFloat(formatEther(balanceData.value))
    : 0;

  useEffect(() => {
    const depositValue = parseFloat(value);
    setValid(depositValue > 0 && depositValue <= userBalance);
  }, [userBalance, value]);

  const loading = !balanceData || balanceLoading || depositLoading;

  return open ? (
    <Modal
      closeButton={!loading}
      aria-labelledby="deposit NFT"
      open={open}
      onClose={() => setOpen(false)}
    >
      <Modal.Header>
        <Text b size={18}>
          Deposit NFT
        </Text>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="flex justify-center pb-4">
            <Loading type="points" color="currentColor" size="lg" />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Input
                {...bindings}
                size="xl"
                status="secondary"
                label="Amount to deposit with NFT"
                placeholder="ETH"
                type="number"
                fullWidth
              />
              <Text className="mt-2 ml-2">
                Balance: {parseFloat(formatEther(balanceData.value)).toFixed(5)}{" "}
                ETH
              </Text>
            </div>
            {!nftApproved ? (
              <ApproveNftButton nftAddress={nftAddress} />
            ) : (
              <Button
                disabled={!valid}
                size="lg"
                color="success"
                onPress={() => {
                  write?.();
                }}
              >
                Confirm
              </Button>
            )}
            {error && <div className="ml-2 text-red-500">{error}</div>}
          </>
        )}
      </Modal.Body>
    </Modal>
  ) : null;
}
