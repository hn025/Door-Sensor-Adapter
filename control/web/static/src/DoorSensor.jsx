import React, {useState} from 'react';

import Container from 'react-bootstrap/Container';
import { TitleCard } from '@dssg/odin-react';
import { WithEndpoint, useAdapterEndpoint } from '@dssg/odin-react';
import Button from 'react-bootstrap/Button';

const EndpointButton = WithEndpoint(Button);


function DoorSensorPage() {
    const [doorIsCurrentlyClosed, setDoorIsCurrentlyClosed] = useState(true);
    const periodicEndpoint = useAdapterEndpoint("react", import.meta.env.VITE_ENDPOINT_URL, 1000);

    var door = ""
    

    if (periodicEndpoint.data?.trueIsOpen && periodicEndpoint.data?.currentState)
        door = "Door is open.";
    else if ((!periodicEndpoint.data?.trueIsOpen) && periodicEndpoint.data?.currentState)
        door = "Door is closed.";
    else if (periodicEndpoint.data?.trueIsOpen && !periodicEndpoint.data?.currentState)
        door = "Door is closed.";
    else if ((!periodicEndpoint.data?.trueIsOpen) && (!periodicEndpoint.data?.currentState))
        door = "Door is open.";

    return (
        <div style={{"margin":"10px"}}>
            <p>{door}</p>
            <p>Close the door then press the button to calibrate.</p>
            <EndpointButton endpoint={periodicEndpoint} event_type="click" fullpath="trueIsOpen" value={!periodicEndpoint.data?.currentState} >Calibrate</EndpointButton>
        </div>
    )
}

export default DoorSensorPage;