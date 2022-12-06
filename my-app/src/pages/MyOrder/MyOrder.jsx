import React, { useEffect } from "react";
import { Avatar,List } from "antd";
import Web3Context from "../../context/Web3Context";

export default function MyOrder() {
  const { fetchListOrder, currentAccount, listOrder } = Web3Context();
  useEffect(() => {
    if (currentAccount) {
      fetchListOrder();
    }
  }, [currentAccount]);
  console.log('listOrder', listOrder)

  return (
    <List
    itemLayout="horizontal"
    size="large"
    pagination={{
      onChange: (page) => {
        console.log(page);
      },
      pageSize: 5,
    }}
    dataSource={currentAccount ? listOrder : []}
    renderItem={(item) => (
      <List.Item key={item.id}>
        <List.Item.Meta
          avatar={<Avatar src={item.avata} />}
          title={item.name}
          description={'Amount: '+item.amount}
        />
        <div>{item.type === '0' ? 'Sell' : 'Buy'} at: {item.orderAt}</div>
      </List.Item>
    )}
  />
  );
}
