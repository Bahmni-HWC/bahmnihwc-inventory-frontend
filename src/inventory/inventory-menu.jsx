import React from "react";
import { Tabs, Tab } from "carbon-components-react";
import { InventoryLandingPage } from "./inventory-landing-page";
import { useCookies } from "react-cookie";
import { getLocationName, inventoryMenu, locationCookieName } from "../../constants";
import { DispensePage } from "./dispense/dispense-page"

const InventoryMenu = () => {
	const [cookies] = useCookies();
	return (
		<div style={{ padding: "2rem" }}>
			<h4>{getLocationName(cookies[locationCookieName]?.name)} </h4>
			<Tabs>
				<Tab label={inventoryMenu[0]}>
					<InventoryLandingPage />
				</Tab>
				<Tab label={inventoryMenu[1]}>
					<DispensePage />
				</Tab>
			</Tabs>
		</div>
	);
};

export default InventoryMenu;
