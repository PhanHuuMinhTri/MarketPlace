import { Layout } from 'antd';
import styled from 'styled-components';

const { Content } = Layout;

export const HeaderStyle = styled(Content)`

height: 70px;

.header{
    height: 100%;
    
    .ant-typography{
        text-align: center;
    }
    .ant-menu{
        line-height: 70px;
    }
    .menu{
        height: 100%;
    }
}
.info{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #008080;
}


`