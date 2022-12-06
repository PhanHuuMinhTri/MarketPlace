import { Layout } from "antd";
import styled from "styled-components";

export const PublicLayoutStyle = styled(Layout)`
  height: 100%;
  width: 100%;

  &.ant-layout {
    display: block;
    width: 100%!;
    height: 100%;

    .wrap-content {
      padding: 15px;
      width: 100%;
      height: calc(100% - 70px);
    }
  }
`;

