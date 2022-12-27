import { Text, Button, Card, Row, Col } from "@nextui-org/react";
import { useState } from "react";
import DepositModal from "../DepositModal";

interface Props {
  userAddress: `0x${string}`;
  nftAddress: `0x${string}`;
  tokenId: number;
}

export default function PositionCard(props: Props) {
  const [depositOpen, setDepositOpen] = useState(false);

  return (
    <>
      <DepositModal open={depositOpen} setOpen={setDepositOpen} {...props} />
      <Card isHoverable>
        <Card.Header css={{ position: "absolute" }}>
          <Text h1 size={20} color="white">
            Zombies4Lyfe #{props.tokenId}
          </Text>
        </Card.Header>
        <Card.Image
          src="https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80"
          objectFit="cover"
          width="100%"
          height="100%"
          alt="Card image background"
        />
        <div className="hidden md:block">
          <Card.Footer
            isBlurred
            css={{
              position: "absolute",
              bgBlur: "#ffffff66",
              borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
              bottom: 0,
              zIndex: 1,
            }}
          >
            <Row align="center">
              <Col>
                <Text color="#000" size={20}>
                  Avg Price: 10 ETH
                </Text>
              </Col>
              <Col>
                <Row justify="flex-end" align="center">
                  <Button
                    flat
                    auto
                    rounded
                    color="success"
                    onPress={() => setDepositOpen(true)}
                  >
                    <Text
                      css={{ color: "inherit" }}
                      size={12}
                      weight="bold"
                      transform="uppercase"
                    >
                      Deposit
                    </Text>
                  </Button>
                </Row>
              </Col>
            </Row>
          </Card.Footer>
        </div>
      </Card>
    </>
  );
}
