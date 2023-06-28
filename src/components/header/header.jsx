import React from "react";
import { Header } from "carbon-components-react";
import styles from "./header.module.scss";
import { inventoryHeaderText } from "../../../constants";

const InventoryHeader = () => {
	return (
		<Header className={styles.header}>
			<div className={styles.headerText}>{inventoryHeaderText}</div>
		</Header>
	);
};

export default InventoryHeader;
