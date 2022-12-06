import React, { useEffect } from "react";
import { List } from "antd";
import { CardComponent } from "../../components";
import Web3Context from "../../context/Web3Context";

export default function DashBoard() {
  const { currentAccount, listTokenSell, fetchListTokenSell } = Web3Context();

  useEffect(() => {
    if (currentAccount) {
      fetchListTokenSell();
    }
  }, [currentAccount]);

  const data = listTokenSell.map((item) => {
    const container = {};
    container["name"] = item[0];
    container["amount"] = item[1];
    container["time"] = item[2];
    container["seller"] = item[3];
    return container;
  });

  return (
    <>
      <List
        grid={{ gutter: 56, column: 5 }}
        dataSource={data.filter((item) => item.amount !== '0')}
        renderItem={(item) => (
          <List.Item>
            <CardComponent name={item.name} amount={item.amount} seller= {item.seller} />
          </List.Item>
        )}
      />
    </>
  );
}
