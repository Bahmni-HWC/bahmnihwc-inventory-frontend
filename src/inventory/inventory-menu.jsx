import React from "react";
import { Tabs, Tab } from "carbon-components-react";
import { InventoryLandingPage } from "./inventory-landing-page";
import { useCookies } from 'react-cookie';

const InventoryMenu = () => {
  const [cookies] = useCookies();
	return (
		<div>
      <h4>Location: {cookies["bahmni.user.location"].name}</h4>
			<Tabs >
				<Tab label="Inventory" >
					<InventoryLandingPage />
				</Tab>
				<Tab label="StockReceipt">
					<div>Content for StockReceipt tab</div>
				</Tab>
				<Tab label="Dispense">
					<div>Content for Dispense tab</div>
				</Tab>
			</Tabs>
		</div>
	);
};

export default InventoryMenu;
