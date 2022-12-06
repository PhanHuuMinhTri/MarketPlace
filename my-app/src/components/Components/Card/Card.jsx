import React, { useEffect, useState } from "react";
import { Card, Button, Image, Typography, Input } from "antd";
import { MoneyCollectOutlined } from "@ant-design/icons";
import DefaultImage from "../../../asset/defaultImage.png";
import Web3Context from "../../../context/Web3Context";
import { WrapperModal } from "./Card.style";
export default function CardComponent({ name, amount, seller }) {
  const {
    currentAccount,
    fetchData,
    sell,
    cancelSell,
    buy,
    loading,
    fetchListMyToken,
    fetchListTokenSell,
  } = Web3Context();
  const [data, setData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [amountSell, setAmountSell] = useState(0);
  const { Text } = Typography;

  useEffect(() => {
    fetchData(setData, name);
  }, [currentAccount]);

  const onChange = (e) => {
    setAmountSell(e.target.value);
  };

  const { Meta } = Card;

  return (
    <>
      <Card
        hoverable
        style={{ width: 240, height: 450 }}
        cover={
          <Image preview={false} alt="example" src={data.img ?? DefaultImage} />
        }
      >
        <Meta title={data.name} description={`Seller by address ${seller}`} />
        Amount: {amount !== 0 ? amount : "Nft not sell"}
        {currentAccount?.address !== "" && (
          <div>
            {seller !== currentAccount.address && (
              <Button
                type="primary"
                onClick={async () => {
                  await buy(name, amount);
                  await fetchListTokenSell();
                  await fetchListMyToken();
                }}
              >
                Buy
              </Button>
            )}

            {seller === currentAccount?.address && amount !== 0 ? (
              <Button
                onClick={async () => {
                  await cancelSell(name);
                  await fetchListMyToken();
                  await fetchListTokenSell();
                }}
              >
                Cancel Sell
              </Button>
            ) : (
              seller === currentAccount.address && (
                <Button
                  type="primary"
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  Sell
                </Button>
              )
            )}
          </div>
        )}
      </Card>
      <WrapperModal
        open={showModal}
        title="Sell Nft"
        onOk={async () => {
          await sell(name, amountSell);
          await fetchListMyToken();
          await fetchListTokenSell();
        }}
        onCancel={() => {
          setShowModal(false);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={async () => {
              await sell(name, amountSell);
              await fetchListMyToken();
              await fetchListTokenSell();
            }}
          >
            Sell
          </Button>,
        ]}
      >
        Name Nft: <Text> {data.name}</Text>
        <Input
          onChange={onChange}
          size="large"
          placeholder="Amount"
          prefix={<MoneyCollectOutlined />}
        />
      </WrapperModal>
    </>
  );
}
