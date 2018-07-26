import document from "document";
import * as messaging from "messaging";
import clock from "clock";

let background = document.getElementById("background");
const appTitle = document.getElementById("appTitle");
const workOrRest = document.getElementById("workOrRest");
const timeLeft = document.getElementById("timeLeft");
const workArc = document.getElementById("work");
const restArc = document.getElementById("rest");
let i=0;


clock.granularity = "seconds";
clock.ontick = evt => {
    appTitle.text = 'Pomodoro Timer';
    workOrRest.text = 'work!';
    timeLeft.text = (268-i).toString() + ' s';
    workArc.sweepAngle=i;
    i++;
}

// Message is received
messaging.peerSocket.onmessage = evt => {
    console.log(`App received: ${JSON.stringify(evt)}`);
    if (evt.data.key === "backgroundColor" && evt.data.newValue) {
        let backgroundColor = JSON.parse(evt.data.newValue);
        console.log(`Setting background color: ${backgroundColor}`);
        background.style.fill = backgroundColor;
    }
    if (evt.data.key === "workArcColor" && evt.data.newValue) {
        let workArcColor = JSON.parse(evt.data.newValue);
        console.log(`Setting working arc color: ${workArcColor}`);
        workArc.style.fill = workArcColor;
    }
    if (evt.data.key === "restArcColor" && evt.data.newValue) {
        let restArcColor = JSON.parse(evt.data.newValue);
        console.log(`Setting resting arc color: ${restArcColor}`);
        restArc.style.fill = restArcColor;
    }
    if (evt.data.key === "textColor" && evt.data.newValue) {
        let textColor = JSON.parse(evt.data.newValue);
        console.log(`Setting resting arc color: ${textColor}`);
        appTitle.style.fill = textColor;
        workOrRest.style.fill = textColor;
        timeLeft.style.fill = textColor;
    }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
    console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.onclose = () => {
    console.log("App Socket Closed");
};