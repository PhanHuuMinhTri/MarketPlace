import React from "react";
import { Routes, Route } from "react-router-dom";

import DashBoard from "../pages/DashBoard/DashBoard";
import MyOrder from "../pages/MyOrder/MyOrder";
import MyToken from "../pages/MyToken/MyToken";
import {
  SuspenseComponent,
  PublicLayout,
} from "../components";
import { Web3ContextProvider } from "../context/Web3Context";

export default function RootRouter() {
  return (
    <SuspenseComponent>
      <Web3ContextProvider>
        <NavigateRouter />
      </Web3ContextProvider>
    </SuspenseComponent>
  );
}

function NavigateRouter() {

  return(
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<DashBoard />} />
        <Route path="/mytoken" element={<MyToken />} />
        <Route path="/myorder" element={<MyOrder />} />
      </Route>
      <Route element={<>404 Page Not Found</>} path="*" />
    </Routes>
  );
}
