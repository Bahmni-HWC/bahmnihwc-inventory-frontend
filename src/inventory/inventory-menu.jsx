import React, { useState } from 'react';
import { Tabs, Tab } from 'carbon-components-react';
import { InventoryLandingPage } from "./inventory-landing-page";


const InventoryMenu = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };

  const renderTabContent = () => {
    switch (activeTabIndex) {
      case 0:
        return <div><InventoryLandingPage/></div>;
      case 1:
        return <div>Content for StockReceipt tab</div>;
      case 2:
        return <div>Content for Dispense tab</div>;
      default:
        return null;
    }
  };

  return (
    <div>
      <Tabs selected={activeTabIndex} onSelectionChange={handleTabChange}>
        <Tab label="Inventory" />
        <Tab label="StockReceipt" />
        <Tab label="Dispense" />
      </Tabs>
      {renderTabContent()}
    </div>
  );
};

export default InventoryMenu;
