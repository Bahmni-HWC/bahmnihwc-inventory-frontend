import React from "react";
import { CookiesProvider } from "react-cookie";
import InventoryMenu from "./inventory/inventory-menu.jsx";
import InventoryHeader from "./components/header/header.jsx";
import "../index.scss";
import { ItemStockProvider } from "./context/item-stock-context.jsx";

const App = () => (
	<CookiesProvider>
		<InventoryHeader />
		<div style={{ paddingTop: "2rem", paddingLeft: "1rem" }}>
			<ItemStockProvider>
				<InventoryMenu />
			</ItemStockProvider>
		</div>
	</CookiesProvider>
);

export default App;
