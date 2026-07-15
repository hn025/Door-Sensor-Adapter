import React, {useState} from 'react';

import Container from 'react-bootstrap/Container';
import { TitleCard } from '@dssg/odin-react';
import { WithEndpoint, useAdapterEndpoint } from '@dssg/odin-react';
import Button from 'react-bootstrap/Button';


const EndpointButton = WithEndpoint(Button);


function DoorSensorPage() {
    const [doorIsCurrentlyClosed, setDoorIsCurrentlyClosed] = useState(true);
    const periodicEndpoint = useAdapterEndpoint("react", import.meta.env.VITE_ENDPOINT_URL, 1000);

    console.log(JSON.stringify(periodicEndpoint.data))

    var door = ""
    var time = null;

    if (periodicEndpoint.data?.trueIsOpen && periodicEndpoint.data?.currentState) {
        door = "Door is open.";
        time = new Date().toLocaleString();
    } else if ((!periodicEndpoint.data?.trueIsOpen) && periodicEndpoint.data?.currentState) {
        door = "Door is closed.";
        time = new Date().toLocaleString();
    } else if (periodicEndpoint.data?.trueIsOpen && !periodicEndpoint.data?.currentState) {
        door = "Door is closed.";
        time = new Date().toLocaleString();
    } else if ((!periodicEndpoint.data?.trueIsOpen) && (!periodicEndpoint.data?.currentState)) {
        door = "Door is open.";
        time = new Date().toLocaleString();
    }
    return (
        <div style={{"margin":"10px"}}>
            <p>{door}</p>
            <p>{time}</p>
            <p>Close the door then press the button to calibrate.</p>
            <EndpointButton endpoint={periodicEndpoint} event_type="click" fullpath="trueIsOpen" value={!periodicEndpoint.data?.currentState} >Calibrate</EndpointButton>
        </div>
    )
}

export default DoorSensorPage;