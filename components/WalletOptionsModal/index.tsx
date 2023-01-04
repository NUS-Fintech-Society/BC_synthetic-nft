import Image from "next/image";
import { useEffect } from "react";
import { useConnect, useAccount } from "wagmi";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { Modal, Text, Button, Loading } from "@nextui-org/react";

interface Props {
  open: boolean;
  setOpen: (showWalletOptions: boolean) => void;
}

export default function WalletOptionsModal(props: Props) {
  const { open, setOpen } = props;

  const {
    connect,
    connectors,
    error,
    isLoading: connectDataLoading,
    pendingConnector,
  } = useConnect();
  const { address, connector: activeConnector, isConnected } = useAccount();

  useEffect(() => {
    address && setOpen(false);
  }, [address, setOpen]);

  return open ? (
    <Modal
      closeButton
      aria-labelledby="connect wallet"
      open={open}
      onClose={() => setOpen(false)}
    >
      <Modal.Header>
        <MdOutlineAccountBalanceWallet className="flex mr-4 text-4xl" />
        <Text b size={18}>
          Choose a Wallet
        </Text>
      </Modal.Header>
      <Modal.Body className="items-center">
        {connectors.map((c) => (
          <div key={c.id} className="flex justify-center w-full">
            {connectDataLoading ? (
              <Button
                size="lg"
                css={{ paddingTop: "2rem", paddingBottom: "2rem" }}
                color="primary"
              >
                <Loading type="points" color="currentColor" size="sm" />
              </Button>
            ) : (
              <Button
                size="lg"
                disabled={!c.ready}
                onClick={() => connect({ connector: c })}
                ghost
                css={{ paddingTop: "2rem", paddingBottom: "2rem" }}
              >
                <div className="flex gap-2">
                  <Image
                    src={`/images/${c.id}.svg`}
                    alt={c.name}
                    height={32}
                    width={32}
                  />
                  {`${c.name}${!c.ready ? " (unsupported)" : ""}`}
                </div>
              </Button>
            )}
          </div>
        ))}
        {error && (
          <div className="ml-2 text-red-500">
            {error?.message ?? "Failed to connect"}
          </div>
        )}
      </Modal.Body>
    </Modal>
  ) : null;
}
