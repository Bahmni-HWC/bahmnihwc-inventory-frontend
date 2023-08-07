import React from 'react';
import { CookiesProvider } from 'react-cookie';
import InventoryMenu from './inventory/inventory-menu';
import InventoryHeader from './components/header/header';
import '../index.scss';
import { ItemStockProvider } from './context/item-stock-context';

const App = () => (
  <CookiesProvider>
    <InventoryHeader />
    <div style={{ paddingTop: '2rem', paddingLeft: '1rem' }}>
      <ItemStockProvider>
        <InventoryMenu />
      </ItemStockProvider>
    </div>
  </CookiesProvider>
);

export default App;
