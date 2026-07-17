import React, { useState, useEffect } from "react";

import Container from 'react-bootstrap/Container';
import { TitleCard } from '@dssg/odin-react';
import { WithEndpoint, useAdapterEndpoint } from '@dssg/odin-react';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast , Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent, { timelineContentClasses } from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';


const EndpointButton = WithEndpoint(Button);


function DoorSensorPage() {
    const [doorIsCurrentlyClosed, setDoorIsCurrentlyClosed] = useState(true);
    const periodicEndpoint = useAdapterEndpoint("react", import.meta.env.VITE_ENDPOINT_URL, 1000);

    var door = CheckDoorState(periodicEndpoint.data?.currentState);
    var time = periodicEndpoint.data?.time;
    const [alertState, setAlertState] = useState(false);

    var timeEntries = [];
    var timelineContents = [];
    var currentTime = new Date();
    var latestTime = getLatestTime().replace(" ", "T");

    function CheckDoorState(state) {
        if (periodicEndpoint.data?.trueIsOpen && state) {
            return "Door is open.";
        } else if ((!periodicEndpoint.data?.trueIsOpen) && state) {
            return "Door is closed.";
        } else if (periodicEndpoint.data?.trueIsOpen && !state) {
            return "Door is closed.";
        } else if ((!periodicEndpoint.data?.trueIsOpen) && (!state)) {
            return "Door is open.";
        }
    }

    function convertStringToDate(dateAsString){
        var date = new Date(dateAsString)
        return date
    }

    function getLatestTime(){
        var latestTime = "";
        if (time){
            for (let i = 0; i < Object.keys(time).length; i++){
                latestTime = Object.keys(time)[i]
            }
        }
        return latestTime
    }
    
    if (time){
        for (let i = 0; i < Object.keys(time).length; i++){
            var date = Object.keys(time)[i];
            var state = time[date]

            timeEntries.push(
                <p style={{"textAlign": "center"}} key={date}>{date.split(".")[0]}: {CheckDoorState(state)}</p>  
            )
            
            if (Object.keys(time).length - i != 1) {
                var connector = <TimelineConnector />
            } 
            else {
                var connector = <></>
            }

            if (CheckDoorState(state) === "Door is open.") var colour = "primary";
            else if (CheckDoorState(state) === "Door is closed.") var colour = "secondary";

            timelineContents.push(
                <TimelineItem>
                    <TimelineOppositeContent color="textSecondary">
                    {date.split(".")[0]}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                    <TimelineDot variant="outlined" color={colour} />
                    {connector}
                    </TimelineSeparator>
                    <TimelineContent>{CheckDoorState(state)}</TimelineContent>
                </TimelineItem>
            )
        }
    }

    function alertFunction() {
        if ((currentTime.getTime() - convertStringToDate(latestTime).getTime() >= 1800000) && door === "Door is open.") {
            if (alertState === false) {
                toast.warn("  Door has been open for more than   30 minutes.", {
                    position: "top-center",
                    closeOnClick: false,
                    theme: "colored",
                    transition: Bounce,
                    autoClose: false
                });
                setAlertState(true)
            }
        }
        if (door === "Door is closed." && alertState){
            setAlertState(false)
        }
    }

    alertFunction()

    return (
        <div style={{"margin":"20px"}}>
            <p>{door}</p>
            <p>Close the door then press the button to calibrate.</p>
            <EndpointButton endpoint={periodicEndpoint} event_type="click" fullpath="trueIsOpen" value={!periodicEndpoint.data?.currentState} >Calibrate</EndpointButton>
            <br/>

            <div style={{width: "45%", display: "inline-block"}}>
                <h3 style={{"textAlign": "center"}}>Log:</h3>
                <br></br>
                <div style={{overflow: "auto", height: "50vh"}}>{timeEntries}</div>
            </div>

            <div style={{width: "45%", display: "inline-block"}}>
                <h3 style={{"textAlign": "center"}}>Timeline:</h3>
                <br></br>
                <div style={{overflow: "auto", height: "50vh"}}>
                    <Timeline
                        sx={{
                            [`& .${timelineContentClasses.root}`]: {
                            flex: 1,
                            },
                        }}
                    >
                    {timelineContents}
                    </Timeline>
                </div>
            </div>

            <ToastContainer />
        </div>
    )
}

export default DoorSensorPage;