import React from "react";
import { Header } from "carbon-components-react";
import styles from "./header.module.scss";
import { inventoryHeaderText } from "../../../constants";
import Home24 from "@carbon/icons-react/lib/home/24";
import { HeaderGlobalAction } from "carbon-components-react";

const InventoryHeader = () => {
	const redirectToHome = () => {
		window.location.href = "/bahmni/home";
	};

	return (
		<Header className={styles.header} aria-label="inventory-header">
			<HeaderGlobalAction
				aria-label="Home"
				className={styles.headerGlobalBarButton}
				onClick={redirectToHome}
			>
			  <Home24 />
			</HeaderGlobalAction>
			<div className={styles.headerText}>{inventoryHeaderText}</div>
		</Header>
	);
};

export default InventoryHeader;
