import "../styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { localhost } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { createTheme, NextUIProvider } from "@nextui-org/react";

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID;

const theme = createTheme({ type: "dark" });

export default function MyApp({ Component, pageProps }: AppProps) {
  localhost.id = 1;
  const { provider } = configureChains([localhost], [publicProvider()]);
  const connectors = [
    new InjectedConnector(),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    }),
    new CoinbaseWalletConnector({
      options: {
        appName: "NextJS-wagmi",
        jsonRpcUrl: `${localhost.rpcUrls[0]}/${infuraId}`,
      },
    }),
  ];
  const client = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={client}>
      <NextUIProvider theme={theme}>
        <Component {...pageProps} />
      </NextUIProvider>
    </WagmiConfig>
  );
}
