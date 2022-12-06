import React, { useEffect } from "react";

import { List } from "antd";
import { CardComponent } from "../../components";
import Web3Context from "../../context/Web3Context";

export default function MyToken() {
  const { currentAccount, fetchListMyToken, listMyToken } = Web3Context();

  useEffect(() => {
    if (currentAccount) {
      fetchListMyToken();
    }
  }, [currentAccount]);

  return (
    <>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={listMyToken}
        renderItem={(item) => (
          <List.Item>
            <CardComponent
              name={item.name}
              amount={item.amount}
              seller={item.seller}
            />
          </List.Item>
        )}
      />
    </>
  );
}
