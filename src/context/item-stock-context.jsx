import React, { useState } from "react";

const ItemStockContext = React.createContext(null);

const useItemStockContext = () => {
	const context = React.useContext(ItemStockContext);

	if (!context) {
		throw new Error(
			`useItemStockContext must be used within Pending Lab Orders scope`
		);
	}
	return {
		itemStock: context.itemStock,
		setItemStock: context.setItemStock,
		itemStockError: context.itemStockError,
		setItemStockError: context.setItemStockError,
	};
};

const useStockRoomContext = () => {
	const context = React.useContext(ItemStockContext);

	if (!context) {
		throw new Error(
			`useItemStockContext must be used within Pending Lab Orders scope`
		);
	}
	return {
		stockRoom: context.stockRoom,
		setStockRoom: context.setStockRoom,
		stockRoomError: context.stockRoomError,
		setStockRoomError: context.setStockRoomError,
	};
};

const ItemStockProvider = ({ children }) => {
	const [itemStock, setItemStock] = useState([]);
	const [itemStockError, setItemStockError] = useState();
	const [stockRoom, setStockRoom] = useState();
	const [stockRoomError, setStockRoomError] = useState();

	const contextValue = {
		itemStock: itemStock,
		setItemStock: setItemStock,
		itemStockError: itemStockError,
		setItemStockError: setItemStockError,
		stockRoom: stockRoom,
		setStockRoom: setStockRoom,
		stockRoomError: stockRoomError,
		setStockRoomError: setStockRoomError,
	};
	return (
		<ItemStockContext.Provider value={contextValue}>
			{children}
		</ItemStockContext.Provider>
	);
};

export { ItemStockProvider, useItemStockContext, useStockRoomContext };
