import React from "react";
import { Header } from "carbon-components-react";
import styles from "./header.module.scss";

const InventoryHeader = () => {
	return (
		<Header className={styles.header}>
			<div>Inventory Management</div>
		</Header>
	);
};

export default InventoryHeader;
