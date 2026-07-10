import 'bootstrap/dist/css/bootstrap.min.css';

import { OdinApp, useAdapterEndpoint, } from "@dssg/odin-react";
import DoorSensorPage from "./DoorSensor";


const App = () => {
  

  return (
    <OdinApp title="door-sensor-react">
      <DoorSensorPage/>
    </OdinApp>
  )
}

export default App
