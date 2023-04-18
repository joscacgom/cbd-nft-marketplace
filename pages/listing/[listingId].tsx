import {
  MediaRenderer,
  useNetwork,
  useNetworkMismatch,
  useListing,
  useContract,
} from "@thirdweb-dev/react";
import {
  ChainId,
  ListingType,
  Marketplace,
  NATIVE_TOKENS,
} from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { marketplaceContractAddress } from "../../addresses";
import Toast from "../../components/Toast";
import styles from "../../styles/Home.module.css";
import Spinner from "../../components/Spinner";
import Link from "next/link";

const ListingPage: NextPage = () => {
  const router = useRouter();


  const { listingId } = router.query as { listingId: string };

  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const { contract: marketplace } = useContract(marketplaceContractAddress, "marketplace");

  const { data: listing, isLoading: loadingListing } = useListing(
    marketplace,
    listingId
  );
  

  const [toastMessage, setToastMessage] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const [toastDuration, setToastDuration] = useState(0);
  const [toastType, setToastType] = useState("");

  function handleRenderToast(message:any, duration:number, type:string) {
    setToastMessage(message);
    setToastDuration(duration);
    setToastType(type);
    setToastShow(true);
  }

  const [bidAmount, setBidAmount] = useState<string>("");

   if (loadingListing) {
     return <Spinner width={"100px"} height="100px"></Spinner>
   }

   if (!listing) {
    return <div className={styles.loadingOrError}>Listing not found</div>

   }

  async function createBidOrOffer() {
    try {
      if (networkMismatch) {
        switchNetwork && switchNetwork(ChainId.Mumbai);
        return;
      }

      if (listing?.type === ListingType.Direct) {
        await marketplace?.direct.makeOffer(
          listingId, 
          1, 
          NATIVE_TOKENS[ChainId.Mumbai].wrapped.address, 
          bidAmount 
        );
      }

      if (listing?.type === ListingType.Auction) {
        await marketplace?.auction.makeBid(listingId, bidAmount);
      }
      
      handleRenderToast(`${listing?.type === ListingType.Auction ? "Bid" : "Offer"} created successfully!`,5000, "success");
    
    } catch (error:any) {
      console.error(error);
      handleRenderToast(error.toString(),5000, "error");

    }
  }

  async function buyNft() {
    try {
      if (networkMismatch) {
        switchNetwork && switchNetwork(ChainId.Mumbai);
        return;
      }

      await marketplace?.buyoutListing(listingId, 1);
      handleRenderToast(`${listing?.type === ListingType.Auction ? "Bid" : "Offer"} created successfully!`,5000, "success")
    } catch (error: any) {
      console.error(error);
      handleRenderToast(error.toString(),5000, "error")
    }
  }

  const handlePolyScan = () => {
    router.push(`https://mumbai.polygonscan.com/address/${listing?.assetContractAddress}`)
  }
  return (
    <div className={styles.container} style={{}}>
      {toastShow && (
        <Toast message={toastMessage} duration={toastDuration} type={toastType} />
        )}
        <div className={styles.listingContainer}>
        <div className={styles.leftListing}>
          <MediaRenderer
            src={listing.asset.image}
            className={styles.mainNftImage}
          />
        </div>

        <div className={styles.rightListing}>
          <h1>{listing.asset.name}</h1>
          <div className={styles.listingDetails}>
            <div className={styles.listingDetail}>
              <p>Contract Address:</p>
              <p style={{fontSize:'14px', color:'grey', marginTop:'-1rem'}}>{listing.assetContractAddress}</p>
              <p>Description:</p>
              <p style={{fontSize:'14px', color:'grey', marginTop:'-1rem'}}>{listing.asset.description}</p>          
            </div>
            <div className={styles.listingDetail} >
              <p>Listing Type: </p>
              <p style={{fontSize:'14px', color:'grey', marginTop:'-1rem'}}>{listing.type === 0 ? 'Direct' : 'Auction'}</p>
              <p>Quantity: </p>
              <p style={{fontSize:'14px', color:'grey', marginTop:'-1rem'}}>{listing.quantity.toString()}</p>
            </div>

          </div>
          <div className={styles.listingDetails}>
          <p>
            Owned by{" "}
            <b>
              {listing.sellerAddress?.slice(0, 6) +
                "..." +
                listing.sellerAddress?.slice(36, 40)}
            </b>
          </p>
          <button className={styles.scanButton} onClick={handlePolyScan}>View on Polyscan</button>
          </div>
          <h2>
            <b>{listing.buyoutCurrencyValuePerToken.displayValue}</b>{" "}
            {listing.buyoutCurrencyValuePerToken.symbol}
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 20,
              alignItems: "center",
            }}
            className={styles.buyAction}
          >
            <button
              style={{ borderStyle: "none" }}
              className={styles.mainButton}
              onClick={buyNft}
            >
              Buy
            </button>
            <p style={{ color: "grey" }}>|</p>
            <div
            className="bidInput"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >

              <input
                type="number"
                name="bidAmount"
                className={styles.textInput}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Amount"
                max={listing.quantity.toString()}
                min={1}
                defaultValue={1}
                style={{ marginTop: 0, marginLeft: 0, width: 128 }}
              />
              <button
                className={styles.mainButton}
                onClick={createBidOrOffer}
                style={{
                  borderStyle: "none",
                  background: "transparent",
                  width: "fit-content",
                }}
              >
                Make Offer
              </button>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default ListingPage;

