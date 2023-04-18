import { useAddress, ConnectWallet } from "@thirdweb-dev/react";
import Link from "next/link";
import React from "react";
import styles from "../styles/Home.module.css";

export default function Header() {
  const address = useAddress();

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div>
          <Link style={{ textDecoration: 'none' }} href="/" passHref role="button">
            <div className={styles.icon}>CBD Marketplace</div>
          </Link>
        </div>
      </div>
      <div className={styles.right}>
        <Link style={{ textDecoration: 'none', color:'#9f2c9d', fontWeight:'600'}} href="/" passHref role="button">
           Listing
        </Link>
        <Link style={{ textDecoration: 'none', color:'#9f2c9d', fontWeight:'600' }} href="/minting" passHref role="button">
           Mint
        </Link>
          <ConnectWallet theme='light' btnTitle="Connect Wallet" />
      </div>
    </div>
  );
}
