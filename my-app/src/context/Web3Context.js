import React, { createContext, useContext, useState, useEffect } from "react";
import Web3 from "web3";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router";
import { TriToken, TriNFT, MarketPlace } from "../contracts";

const CHECK_CONNECT_METAMASK = "isConnectedMetamask";
const { ethereum } = window;
let myWeb3 = null;
if (ethereum) {
  myWeb3 = new Web3(ethereum);
}

export const web3 = myWeb3;

export const InitWeb3Context = createContext();

export default function Web3Context() {
  return useContext(InitWeb3Context);
}

export const getContract = (abi, address) => {
  return { web3Contract: new web3.eth.Contract(abi, address) };
};

const { web3Contract: erc20Contract } = getContract(
  TriToken.abi,
  TriToken.address
);
const { web3Contract: nftContract } = getContract(TriNFT.abi, TriNFT.address);
const { web3Contract: marketPlaceContract } = getContract(
  MarketPlace.abi,
  MarketPlace.address
);

export const Web3ContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState({
    address: "",
    balanceTTK: null,
    balanceETH: null,
  });

  const navigate = useNavigate();
  const [hasUser, setHasUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [listMyToken, setListMyToken] = useState([]);
  const [listTokenSell, setListTokenSell] = useState([]);
  const [listOrder, setListOrder] = useState([]);

  const connectMetaMask = async () => {
    setLoading(true);
    if (!ethereum) return alert("Please install metamask");
    await ethereum.request({
      method: "eth_requestAccounts",
    });

    const addressWallet = await web3.eth.requestAccounts();

    const balanceETH = await web3.eth.getBalance(addressWallet[0]);

    const balanceTTK = await erc20Contract.methods
      .balanceOf(addressWallet[0])
      .call({ from: addressWallet[0] });
    setCurrentAccount({
      address: addressWallet[0],
      balanceTTK: balanceTTK,
      balanceETH: web3.utils.fromWei(balanceETH, "micro"),
    });
    setHasUser(true);
    navigate("/");
    setLoading(false);
    localStorage.setItem(CHECK_CONNECT_METAMASK, true);
  };

  const checkWalletConnected = async () => {
    if (!ethereum) return alert("Please install metamask");

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts?.length) {
      web3.eth.getBalance(accounts).then((bal) => {
        setCurrentAccount({
          address: accounts,
          balance: web3.utils.toWei(bal, "ether"),
        });
        setHasUser(true);
      });
    }
  };

  const isAccountConnected = () =>
    !!localStorage.getItem(CHECK_CONNECT_METAMASK);

  useEffect(() => {
    if (isAccountConnected()) {
      checkWalletConnected();
    }
  }, []);

  const disconnectWallet = async () => {
    localStorage.clear();
    setHasUser(false);
    setCurrentAccount({ address: "", balance: null });
    setListOrder([]);
    setListMyToken([]);
    navigate("/");
  };

  const fetchData = async (setData, id) => {
    try {
      setLoading(true);
      const tokenUri = await nftContract.methods.tokenURI(id).call();
      const res = await axios.get(tokenUri);
      await setData({ id: id, name: res.data.name, img: res.data.image });
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const getInfo = async (id) => {
    try {
      setLoading(true);
      const tokenUri = await nftContract.methods.tokenURI(id).call();
      const res = await axios.get(tokenUri);
      setLoading(false);
      return res;
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const fetchListTokenSell = async () => {
    try {
      setLoadingScreen(true);
      const listToken = await marketPlaceContract.methods
        .getListTokenSell()
        .call();
      await setListTokenSell(listToken);
      setLoadingScreen(false);
    } catch (error) {
      console.log("error", error);
      setLoadingScreen(false);
    }
  };

  const fetchListMyToken = async () => {
    try {
      setLoadingScreen(true);
      const listTokenSell = (
        await marketPlaceContract.methods.getListTokenSell().call()
      ).map((item) => ({ name: item[0], amount: item[1], seller: item[3] }));
      const listToken = await nftContract.methods.getListNft().call();

      const asyncFilter = async (arr, predicate) => {
        const results = await Promise.all(arr.map(predicate));
        return arr.filter((_v, index) => results[index]);
      };
      const listMyTokenSell = listTokenSell.filter(
        (item) => item.seller === currentAccount.address
      );
      const listMyToken = await (
        await asyncFilter(listToken, async (item) => {
          const owner = await nftContract.methods.ownerOf(item).call();
          return (await owner) === currentAccount.address;
        })
      ).map((item) => ({
        name: item,
        amount: 0,
        seller: currentAccount.address,
      }));
      await setListMyToken(listMyTokenSell.concat(listMyToken));
      setLoadingScreen(false);
    } catch (error) {
      console.log("error", error);
      setLoadingScreen(false);
    }
  };

  const fetchListOrder = async () => {
    try {
      setLoadingScreen(true);
      const listOrder = await marketPlaceContract.methods
        .getListOrder(currentAccount?.address)
        .call();

      const fix = await Promise.all(
        listOrder.map(async (item) => {
          const res = await getInfo(item.tokenId);
          const time = new Date(Number(item.orderAt) * 1000);
          const day= time.getDate();
          const month =time.getMonth() +1;
          const year = time.getFullYear();


          return {
            id: item.tokenId,
            name: res.data.name,
            avata: res.data.image,
            type: item.typeOrder,
            orderAt: `${day}/${month}/${year}`,
            amount: item.amountToken,
          };
        })
      );

      await setListOrder(fix);
      setLoadingScreen(false);
    } catch (error) {
      console.log("error", error);
      setLoadingScreen(false);
    }
  };

  const sell = async (tokenId, amount) => {
    try {
      setLoading(true);
      await nftContract.methods
        .approve(MarketPlace.address, tokenId)
        .send({ from: currentAccount.address });
      await marketPlaceContract.methods
        .sell(tokenId, amount)
        .send({ from: currentAccount.address });
      message.success("Sell NFT Success");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Sell NFT Fail");
      console.log("error", error);
    }
  };

  const cancelSell = async (tokenID) => {
    try {
      setLoadingScreen(true);
      await marketPlaceContract.methods
        .cancelSell(tokenID)
        .send({ from: currentAccount.address });
      setLoadingScreen(false);
      message.success("Cancel Sell Success");
    } catch (error) {
      message.error("Cancel Sell Fail");
      setLoadingScreen(false);
      console.log("error", error);
    }
  };

  const buy = async (tokenId, amount) => {
    try {
      setLoadingScreen(true);
      await erc20Contract.methods
        .approve(MarketPlace.address, amount)
        .send({ from: currentAccount.address });

      await marketPlaceContract.methods
        .buy(tokenId, amount)
        .send({ from: currentAccount.address });
      setLoadingScreen(false);
      message.success("Buy NFT Success");
    } catch (error) {
      message.error("Buy NFT Fail");
      setLoadingScreen(false);
      console.log("error", error);
    }
  };

  return (
    <InitWeb3Context.Provider
      value={{
        connectMetaMask,
        checkWalletConnected,
        currentAccount,
        setCurrentAccount,
        hasUser,
        setHasUser,
        disconnectWallet,
        loading,
        setLoading,
        loadingScreen,
        setLoadingScreen,
        listMyToken,
        listTokenSell,
        listOrder,
        fetchListOrder,
        fetchListMyToken,
        fetchListTokenSell,
        fetchData,
        getInfo,
        sell,
        cancelSell,
        buy,
      }}
    >
      {children}
    </InitWeb3Context.Provider>
  );
};
