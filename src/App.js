import React from "react";
import "carbon-components/scss/globals/scss/styles.scss";
import InventoryMenu from "./inventory/inventory-menu";
import { CookiesProvider } from "react-cookie";
import InventoryHeader from "./components/header/header";
import '../index.scss'

const App = () => {
	return (
    <CookiesProvider>
      <InventoryHeader />
      <div style={{marginTop:'2rem'}}>
			<InventoryMenu />
      </div>
		</CookiesProvider>
	);
};

export default App;
