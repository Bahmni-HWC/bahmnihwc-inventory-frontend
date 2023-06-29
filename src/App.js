import React from "react";
import { CookiesProvider } from "react-cookie";
import InventoryMenu from "./inventory/inventory-menu.jsx";
import InventoryHeader from "./components/header/header.jsx";
import"../index.scss"

const App = () => (
    <CookiesProvider>
      <InventoryHeader />
      <div style={{padding:'3rem'}}>
			<InventoryMenu />
      </div>
		</CookiesProvider>
	);

export default App;
