import React, { useMemo } from "react";
import { Row, Col, Menu, Typography, Button, Divider, Tooltip } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import Web3Context from "../../../../../context/Web3Context";
import { HeaderStyle } from "./Header.style";
import { getEllipsisTxt } from "../../../../../utils/format";

export default function HeaderComponent() {
  const { currentAccount, connectMetaMask, disconnectWallet } = Web3Context();

  const { Text } = Typography;
  const location = useLocation();
  const selectedItem = useMemo(() => {
    const splitPath = location.pathname.split("/");
    if (splitPath.length > 2) {
      return `/${splitPath[1]}`;
    }
    return location.pathname;
  }, [location]);

  const items = [
    {
      label: (
        <Link to={"/"}>
          <Text>DashBoard</Text>
        </Link>
      ),
      key: "/",
      icon: <ShoppingCartOutlined />,
    },
    {
      label: (
        <Link to={"/mytoken"}>
          <Text>MyToken</Text>
        </Link>
      ),
      key: "/mytoken",
      icon: <ShoppingOutlined />,
    },
    {
      label: (
        <Link to={"/myorder"}>
          <Text>MyOrder</Text>
        </Link>
      ),
      key: "/myorder",
      icon: <SnippetsOutlined />,
    },
  ];

  return (
    <HeaderStyle>
      <Row className="header">
        <Col span={12}>
          <Menu
            className="menu"
            mode="horizontal"
            theme="dark"
            items={items}
            selectedKeys={[selectedItem]}
          />
        </Col>

        <Col span={12} className="info">
          <Text>
            {" "}
            {currentAccount.balanceETH} <Text>ETH</Text>
          </Text>
          <Divider type="vertical" />
          <Text>
            {" "}
            {currentAccount.balanceTTK} <Text>TTK</Text>
          </Text>
          <Divider type="vertical" />
          {currentAccount.address !== "" ? (
            <>
              <Tooltip title={currentAccount.address}>
                <Text>{getEllipsisTxt(currentAccount.address, 6)}</Text>
              </Tooltip>

              <Button
                onClick={() => {
                  disconnectWallet();
                }}
              >
                Disconnect Wallet
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                connectMetaMask();
              }}
            >
              Wallet Connect
            </Button>
          )}
        </Col>
      </Row>
    </HeaderStyle>
  );
}
