import React, { useEffect } from "react";
import { Tabs, Tab, Loading } from "carbon-components-react";
import { InventoryLandingPage } from "./inventory-landing-page";
import { useCookies } from "react-cookie";
import {
	getLocationName,
	inventoryMenu,
	locationCookieName,
} from "../../constants";
import { DispensePage } from "./dispense/dispense-page";
import StockReceipt from "../stock-receipt/stock-receipt";
import { fetcher, invItemURLByStockroom, stockRoomURL } from "../utils/api-utils";
import useSWR from "swr";
import {
	useItemStockContext,
	useStockRoomContext,
} from "../context/item-stock-context";
import { notification } from "../components/notifications/notification";

const InventoryMenu = () => {
	const [cookies] = useCookies();
	const { setItemStock, setItemStockError } = useItemStockContext();
	const { setStockRoom, setStockRoomError } = useStockRoomContext();

	const { data: stockRoom, error: stockRoomError } = useSWR(
		stockRoomURL(cookies[locationCookieName]?.name.trim()),
		fetcher
	);

	const { data: items, error: inventoryItemError } = useSWR(
		stockRoom ? invItemURLByStockroom(stockRoom.results[0].uuid) : "",
		fetcher
	);

	useEffect(() => {
		if (items) {
			setItemStock(items.results);
		}
		if (inventoryItemError) {
			setItemStockError(inventoryItemError);
		}
	}, [items, inventoryItemError]);

	useEffect(() => {
		if (stockRoom) {
			setStockRoom(stockRoom.results);
		}
		if (stockRoomError) {
			setStockRoomError(stockRoomError);
		}
	}, [stockRoom, stockRoomError]);

	if (
		(items == undefined && inventoryItemError == undefined) ||
		(!stockRoom && !stockRoomError)
	)
		return <Loading />;

	return inventoryItemError ? (
		<div>{notification("error","Error","Something went wrong while fetching URL")}</div>
	) : (
		<div style={{ paddingTop: "2rem" }}>
			<h4>{getLocationName(cookies[locationCookieName]?.name)} </h4>
			<Tabs>
				<Tab label={inventoryMenu[0]}>
					<InventoryLandingPage />
				</Tab>
				<Tab label="Stock Receipt">
					<StockReceipt />
				</Tab>
				<Tab label={inventoryMenu[1]}>
					<DispensePage />
				</Tab>
			</Tabs>
		</div>
	);
};

export default InventoryMenu;
