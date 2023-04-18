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
          <ConnectWallet theme='dark' btnTitle="Connect Wallet" />
      </div>
    </div>
  );
}
