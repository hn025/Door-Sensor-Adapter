import 'bootstrap/dist/css/bootstrap.min.css';

import { OdinApp, useAdapterEndpoint, } from "@dssg/odin-react";
import DoorSensorPage from "./DoorSensor";
import OccupancySensorPage from "./OccupancySensor";

const App = () => {
  

  return (
      <OdinApp title="door-sensor-react"
      navLinks={["Door Sensor", "Occupancy Sensor"]}>
      <DoorSensorPage/>
      <OccupancySensorPage/>
    </OdinApp>
  )
}

export default App