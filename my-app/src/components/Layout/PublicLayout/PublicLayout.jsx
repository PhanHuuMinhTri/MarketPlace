import React from "react";
import HeaderComponent from "./components/Header/Header";
import { Spin } from "antd";
import { useOutlet } from "react-router-dom";
import Web3Context from "../../../context/Web3Context";
import { PublicLayoutStyle } from "./PublicLayout.style";
export default function PublicLayout() {
  const outlet = useOutlet();
  const { loadingScreen } = Web3Context();
  return (
    <Spin spinning={loadingScreen}>
      <PublicLayoutStyle>
        <HeaderComponent />
        <div className="wrap-content">{outlet}</div>
      </PublicLayoutStyle>
    </Spin>
  );
}
