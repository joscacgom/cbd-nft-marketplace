import type { NextPage } from "next";
import styles from "../../styles/Home.module.css";
import Link from "next/link";
import {
  MediaRenderer,
  useActiveListings,
  useContract,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { marketplaceContractAddress } from "../../addresses";
import Spinner from "../../components/Spinner";

const Mint: NextPage = () => {
  const router = useRouter();
 

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.h1}>Mint and claim your NFT</h1>
        <hr className={styles.divider} />

        <div className="main">
          
        </div>
      </div>
    </>
  );
};

export default Mint;
