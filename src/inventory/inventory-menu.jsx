import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Loading } from 'carbon-components-react';
import { useCookies } from 'react-cookie';
import useSWR, { mutate } from 'swr';
import InventoryLandingPage from './inventory-landing-page';
import { getLocationName, inventoryMenu, locationCookieName } from '../../constants';
import DispensePage from './dispense/dispense-page';
import Aushada from './aushada/aushada';
import { fetcher, invItemURLByStockroom, stockRoomURL } from '../utils/api-utils';
import { useItemStockContext, useStockRoomContext } from '../context/item-stock-context';
import { ResponseNotification } from '../components/notifications/response-notification';

const InventoryMenu = () => {
  const [cookies] = useCookies();
  const { setItemStock, setItemStockError } = useItemStockContext();
  const { setStockRoom, setStockRoomError } = useStockRoomContext();
  const [reloadData, setReloadData] = React.useState(false);
  const [totalInventoryItemsInStockroom, setTotalInventoryItemsInStockroom] = useState(1);

  const { data: stockRoom, error: stockRoomError } = useSWR(
    stockRoomURL(cookies[locationCookieName]?.name.trim()),
    fetcher,
  );

  const { data: invItems, error: inventoryItemsError } = useSWR(
    stockRoom
      ? invItemURLByStockroom(stockRoom.results[0].uuid, totalInventoryItemsInStockroom)
      : '',
    fetcher,
  );

  const { data: items, error: inventoryItemError } = useSWR(
    stockRoom && totalInventoryItemsInStockroom !== undefined
      ? invItemURLByStockroom(stockRoom.results[0].uuid, totalInventoryItemsInStockroom)
      : '',
    fetcher,
  );

  useEffect(() => {
    setTotalInventoryItemsInStockroom(invItems?.length ? invItems.length : 1);
  }, [invItems]);

  useEffect(() => {
    if (reloadData) {
      mutate(invItemURLByStockroom(stockRoom.results[0].uuid, totalInventoryItemsInStockroom));
    }
  }, [reloadData]);

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

  if ((items === undefined && inventoryItemError === undefined) || (!stockRoom && !stockRoomError))
    return <Loading />;

  return inventoryItemError ? (
    <div>{ResponseNotification('error', 'Error', 'Something went wrong while fetching URL')}</div>
  ) : (
    <div style={{ paddingTop: '2rem' }}>
      <h4>{getLocationName(cookies[locationCookieName]?.name)} </h4>
      <Tabs>
        <Tab label={inventoryMenu[0]}>
          <InventoryLandingPage  setReloadData={setReloadData}/>
        </Tab>
        <Tab label='Aushada'>
          <Aushada setReloadData={setReloadData} />
        </Tab>
        <Tab label={inventoryMenu[1]}>
          <DispensePage setReloadData={setReloadData} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default InventoryMenu;
