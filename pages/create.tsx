import {
  useContract,
  useNetwork,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import {
  ChainId,
  NATIVE_TOKEN_ADDRESS,
  TransactionResult,
} from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { marketplaceContractAddress } from "../addresses";
import styles from "../styles/Home.module.css";

const Create: NextPage = () => {
  const router = useRouter();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const { contract: marketplace } = useContract(marketplaceContractAddress, "marketplace");

  async function handleCreateListing(e: any) {
    try {
      if (networkMismatch) {
        switchNetwork && switchNetwork(ChainId.Mumbai);
        return;
      }

      e.preventDefault();

      let transactionResult: undefined | TransactionResult = undefined;


      const { listingType, contractAddress, tokenId, price } =
        e.target.elements;

      if (listingType.value === "directListing") {
        transactionResult = await createDirectListing(
          contractAddress.value,
          tokenId.value,
          price.value
        );
      }

      if (listingType.value === "auctionListing") {
        transactionResult = await createAuctionListing(
          contractAddress.value,
          tokenId.value,
          price.value
        );
      }

      if (transactionResult) {
        router.push(`/`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createAuctionListing(
    contractAddress: string,
    tokenId: string,
    price: string
  ) {
    try {
      const transaction = await marketplace?.auction.createListing({
        assetContractAddress: contractAddress, 
        buyoutPricePerToken: price, 
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, 
        listingDurationInSeconds: 60 * 60 * 24 * 7, 
        quantity: 1, 
        reservePricePerToken: 0, 
        startTimestamp: new Date(), 
        tokenId: tokenId, 
      });

      return transaction;
    } catch (error) {
      console.error(error);
    }
  }

  async function createDirectListing(
    contractAddress: string,
    tokenId: string,
    price: string
  ) {
    try {
      const transaction = await marketplace?.direct.createListing({
        assetContractAddress: contractAddress, 
        buyoutPricePerToken: price, 
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, 
        listingDurationInSeconds: 60 * 60 * 24 * 7, 
        quantity: 1, 
        startTimestamp: new Date(0), 
        tokenId: tokenId, 
      });

      return transaction;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={(e) => handleCreateListing(e)}>
      <div className={styles.container}>
        <div className={styles.collectionContainer}>
          <h1 className={styles.ourCollection}>
            Upload your NFT to the marketplace:
          </h1>
          <div className={styles.listingTypeContainer}>
            <input
              type="radio"
              name="listingType"
              id="directListing"
              value="directListing"
              defaultChecked
              className={styles.listingType}
            />
            <label htmlFor="directListing" className={styles.listingTypeLabel}>
              Direct Listing
            </label>
            <input
              type="radio"
              name="listingType"
              id="auctionListing"
              value="auctionListing"
              className={styles.listingType}
            />
            <label htmlFor="auctionListing" className={styles.listingTypeLabel}>
              Auction Listing
            </label>
          </div>
          <input
            type="text"
            name="contractAddress"
            className={styles.textInput}
            placeholder="NFT Contract Address"
          />
          <input
            type="text"
            name="tokenId"
            className={styles.textInput}
            placeholder="NFT Token ID"
          />
          <input
            type="text"
            name="price"
            className={styles.textInput}
            placeholder="Sale Price"
          />

          <button
            type="submit"
            className={styles.mainButton}
            style={{ marginTop: 32, borderStyle: "none" }}
          >
            List NFT
          </button>
        </div>
      </div>
    </form>
  );
};

export default Create;
