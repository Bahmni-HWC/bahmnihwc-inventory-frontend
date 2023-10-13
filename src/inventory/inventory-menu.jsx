import React, { useEffect } from 'react';
import { Tabs, Tab, Loading } from 'carbon-components-react';
import { useCookies } from 'react-cookie';
import useSWR from 'swr';
import InventoryLandingPage from './inventory-landing-page';
import { getLocationName, inventoryMenu, locationCookieName } from '../../constants';
import DispensePage from './dispense/dispense-page';
import Aushada from './aushada/aushada';
import { fetcher, getRequest, invItemURLByStockroom, stockRoomURL } from '../utils/api-utils';
import { useItemStockContext, useStockRoomContext } from '../context/item-stock-context';
import { ResponseNotification } from '../components/notifications/response-notification';

const InventoryMenu = () => {
  const [cookies] = useCookies();
  const { setItemStock, setItemStockError } = useItemStockContext();
  const { setStockRoom, setStockRoomError } = useStockRoomContext();
  const { itemStock ,itemStockError} = useItemStockContext();
  const [reloadData, setReloadData] = React.useState(false);
  const [totalInventoryItemsInStockroom, setTotalInventoryItemsInStockroom] = React.useState(null);
  
  const { data: stockRoom, error: stockRoomError } = useSWR(
    cookies[locationCookieName]?.name.trim() ? stockRoomURL(cookies[locationCookieName]?.name.trim()) : null,
    fetcher
  );

  useEffect(() => {
    if (stockRoom) {
      setStockRoom(stockRoom.results);
    }
    if (stockRoomError) {
      setStockRoomError(stockRoomError);
    }
  }, [stockRoom, stockRoomError]);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        if (stockRoom) {
          const response = await getRequest(invItemURLByStockroom(stockRoom.results[0].uuid, totalInventoryItemsInStockroom));
          setItemStock(response.results);
          if (response.length !== totalInventoryItemsInStockroom) {
            setTotalInventoryItemsInStockroom(response.length);
          }
        }
      } catch (error) {
        setItemStockError(error);
      }
    };
    fetchInventoryItems();
  }, [reloadData,stockRoom,totalInventoryItemsInStockroom]);

  if ((itemStock === undefined && itemStockError === undefined) || (!stockRoom && !stockRoomError))
    return <Loading />;

  return itemStockError ? (
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
