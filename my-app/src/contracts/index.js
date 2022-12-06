
import marketPlaceAbi from "./abi/MarketPlace.json";
import triNftAbi from "./abi/TriNFT.json";
import triToken from "./abi/TriToken.json";

export const MarketPlace = {
    address: '0x1183d167BfB5228a1c0AFd511A9d0177eC45E4e8',
    abi: marketPlaceAbi
};

export const TriToken = {
    address: '0x1743612e752b2cb0c3c5aed4f4eC8103cb6E0cc2',
    abi: triToken
}

export const TriNFT = {
    address: '0x3bF38F9167fC342E2888CA4408C0702401bc6d83',
    abi: triNftAbi
}

export const options = {
    gasPrice: 20000000000,
    gas: 1000000,
}
