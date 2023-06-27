import React from "react";
import { InventoryLandingPage } from "./inventory/inventory-landing-page";
import {Dropdown } from 'carbon-components-react'
import 'carbon-components/scss/globals/scss/styles.scss';
import InventoryMenu from "./inventory/inventory-menu";
import UserLocation from "./inventory/user-location";
const App = () =>{
  const items = ['HWC1','HWC2','HWC3']
  return  <div>
       <UserLocation/>


        {/*<Dropdown
          id="hwc-list-dropdown"
          title="hwc list"
          items={items}
          itemToString={data => data}
          label="Select HWC"
        //   onChange={({selectedItem}) => setDoctor(selectedItem)}
          // selectedItem={"doctor"}
        />*/}
        <InventoryMenu/>

       {/* <InventoryLandingPage/>*/}
    </div>
}

export default App