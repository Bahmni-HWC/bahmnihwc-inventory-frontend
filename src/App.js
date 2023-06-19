import React from "react";
import { InventoryLandingPage } from "./inventory/inventory-landing-page";
import {Dropdown } from 'carbon-components-react'

const App = () =>(
    <div>
        {/* <Dropdown>HWC</Dropdown> */}
        <Dropdown
          id="hwc-list-dropdown"
          title="hwc list"
          items={items}
          itemToString={data => data.person?.display}
          label="Select HWC"
        //   onChange={({selectedItem}) => setDoctor(selectedItem)}
          selectedItem={"doctor"}
        />
        <InventoryLandingPage></InventoryLandingPage>
    </div>
    )

export default App