import React, {useState} from 'react';

import Container from 'react-bootstrap/Container';
import { TitleCard } from '@dssg/odin-react';
import { WithEndpoint, useAdapterEndpoint } from '@dssg/odin-react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton';


const EndpointDropdown = WithEndpoint(DropdownButton);


function OccupancySensorPage() {
    const periodicEndpoint = useAdapterEndpoint("react", import.meta.env.VITE_ENDPOINT_URL, 1000);

    var range = null
    var status = ""
    var presence = null
    var distance = null
    var version = periodicEndpoint.data?.mmWaveVersion
    var mode = ""
    var modeList = ["normal", "report"]

    console.log(periodicEndpoint.data)

    function changeMode(event){
        periodicEndpoint.put({["mmWaveMode"]:event}, "mmWaveMode")
        .then(response => {
            periodicEndpoint.mergeData(response, "mmWaveMode");
        })
        .catch((err) => {
            console.error(err);
        });
    }

    if (periodicEndpoint.data?.mmWaveMode === "normal") {
        range = periodicEndpoint.data?.mmWaveData.range
        status = periodicEndpoint.data?.mmWaveData.status
        mode = "Report mode"

        return (
        <div style={{"margin":"10px"}}>
            <p>Version: {version}</p>
            <p>Range: {range}</p>
            <p>Status: {status}</p>
            <EndpointDropdown endpoint={periodicEndpoint} event_type="select" fullpath="mmWaveMode" title={periodicEndpoint.data?.mmWaveMode || "Unknown"}>
                {modeList.map(
                    (value, index) => (
                        <Dropdown.Item eventKey={value} key={index}>{value}</Dropdown.Item>
                    ))
                }
            </EndpointDropdown>
        </div>
        )

    } else if (periodicEndpoint.data?.mmWaveMode === "report") {
        presence = periodicEndpoint.data?.mmWaveData.presence
        distance = periodicEndpoint.data?.mmWaveData.distance
        mode = "Normal mode"

        if (presence) presence = "Yes";
        else presence = "No";

        return (
        <div style={{"margin":"10px"}}>
            <p>Version: {version}</p>
            <p>Presence: {presence}</p>
            <p>Distance: {distance}cm</p>
            <EndpointDropdown endpoint={periodicEndpoint} event_type="select" fullpath="mmWaveMode" title={periodicEndpoint.data?.mmWaveMode || "Unknown"}>
                {modeList.map(
                    (value, index) => (
                        <Dropdown.Item eventKey={value} key={index}>{value}</Dropdown.Item>
                    ))
                }
            </EndpointDropdown>
        </div>
        )

    }
    
    
}

export default OccupancySensorPage;