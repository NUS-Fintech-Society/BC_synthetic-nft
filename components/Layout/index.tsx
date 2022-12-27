import Head from "next/head";
import Image from "next/image";
import { ReactNode } from "react";
import { WalletOptionsModal } from "..";
import { useAccount } from "wagmi";
import { Navbar, Text, Button, Loading, Dropdown } from "@nextui-org/react";
import { useRouter } from "next/router";

interface Props {
  children: ReactNode;
  showWalletOptions: boolean;
  setShowWalletOptions: (showWalletOptions: boolean) => void;
}

export default function Layout(props: Props) {
  const { children, showWalletOptions, setShowWalletOptions } = props;

  const { address, isConnecting: accountLoading, connector } = useAccount();
  const { pathname } = useRouter();

  const renderLabel = () => {
    return <span className="truncate max-w-[150px]">{address}</span>;
  };

  const renderButton = () => {
    if (address) {
      return (
        <Dropdown>
          <Dropdown.Button flat>{renderLabel()}</Dropdown.Button>
          <Dropdown.Menu
            aria-label="Static Actions"
            onAction={connector?.disconnect}
          >
            <Dropdown.Item key="disconnect">Disconnect</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    }

    const disable = accountLoading || showWalletOptions;
    return (
      <Button
        disabled={disable}
        auto
        ghost
        bordered
        onClick={() => setShowWalletOptions(true)}
      >
        {disable ? (
          <Loading type="points" color="currentColor" size="sm" />
        ) : (
          "Connect"
        )}
      </Button>
    );
  };

  return (
    <div>
      <Head>
        <title>Fluidity</title>
        <meta
          name="description"
          content="Giving NFTs liquidity via synthetic tokens"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WalletOptionsModal
        open={showWalletOptions}
        setOpen={setShowWalletOptions}
      />

      <Navbar>
        <Navbar.Brand>
          <Text b color="inherit" hideIn="xs">
            Fluidity
          </Text>
        </Navbar.Brand>
        <Navbar.Content hideIn="xs">
          <Navbar.Link isActive={pathname == "/"} href="/">
            Pools
          </Navbar.Link>
          <Navbar.Link isActive={pathname == "/positions"} href="/positions">
            Positions
          </Navbar.Link>
        </Navbar.Content>
        <Navbar.Content>{renderButton()}</Navbar.Content>
      </Navbar>
      {children}
    </div>
  );
}
