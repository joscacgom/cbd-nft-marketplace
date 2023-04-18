import React from "react";
import styles from "../styles/Home.module.css";

type Props = {
  width?: string;
  height?: string;
};

export default function Skeleton({ height, width }: Props) {
  return (
    <div
      style={{
        width,
        height,
        marginTop: "10rem",
        borderRadius: "inherit",
      }}
      className={styles.skeleton}
    />
  );
}