import React from "react";
import RootRouter from "./routes/RootRouter";
import { AppStyle } from "./App.style";
import "./App.css";

function App() {
  return (
    <AppStyle>
      <RootRouter />
    </AppStyle>
  );
}

export default App;
