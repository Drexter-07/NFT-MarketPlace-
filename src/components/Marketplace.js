import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function Marketplace() {
const sampleData = [
    {
        "name": "NFT#1",
        "description": "1st NFT",
        "website":"https://filecoin.io/",
        "image":"https://gateway.pinata.cloud/ipfs/QmYHg3WbVHBcs7QYpH1gGwtJZNaAEBXWzSu13o2hppyRDT",
        "price":"0.07ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf557CB4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "NFT#2",
        "description": "2nd NFT",
        "website":"https://filecoin.io/",
        "image":"https://gateway.pinata.cloud/ipfs/QmZ95STtEZeaiJDPVyEg4hafjW1LJQS7z7gmDCm9phzSC8",
        "price":"0.13ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf557C4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "NFT#3",
        "description": "3rd NFT",
        "website":"https://filecoin.io/",
        "image":"https://gateway.pinata.cloud/ipfs/QmTLTn7bjUnbCRJEafWnACpwuGzpqq81nHQ3i6w3qhMeuK",
        "price":"0.20ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf757C4f7F82a2F23b1e59bE45c33c5b13",
    },
];
const [data, updateData] = useState(sampleData);
const [dataFetched, updateFetched] = useState(false);

async function getAllNFTs() {
    const ethers = require("ethers");
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    const signer = provider.getSigner();
    
   
    
    //Pulling the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    let transaction = await contract.getAllNFTs()

    //Fetching all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
        var tokenURI = await contract.tokenURI(i.tokenId);
        console.log("getting this tokenUri", tokenURI);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
}

if(!dataFetched)
    getAllNFTs();

return (
    <div>
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-20">
            <div className="md:text-xl font-bold text-white">
                Top NFTs
            </div>
            <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
        </div>            
    </div>
);

}