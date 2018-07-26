import document from "document";
import * as messaging from "messaging";
import clock from "clock";

let background = document.getElementById("background");
const workOrRest = document.getElementById("workOrRest");
const timeLeft = document.getElementById("timeLeft");
const workArc = document.getElementById("work");
const restArc = document.getElementById("rest");
const buttonPause = document.getElementById("btn-tr");
const buttonPlay = document.getElementById("btn-br");
const buttonReset = document.getElementById("btn-bl");
const buttonForward = document.getElementById("btn-tl");

let workingTime = 45;
let restingTime = 15;
let i=0;
let working = false;

workOrRest.text = 'press start!';
clock.granularity = "seconds";
clock.ontick = evt => {
    timeLeft.text = (268-i).toString() + ' s';
    workArc.sweepAngle=i;
    i++;
}
buttonReset.onactivate = evt => {
    working = false;
    workOrRest.text = 'press start!';
}
buttonForward.onactivate = evt => {
    if (working) {
        working = false;
        workOrRest.text = 'rest!';
    } else {
        working = true;
        workOrRest.text = 'work!';
    }
}
buttonPlay.onactivate = evt => {
    if (!working) {
        working = true;
        workOrRest.text = 'work!';
    }
}
buttonPause.onactivate = evt => {
    if(working) {
        working = false;
        workOrRest.text = 'rest!';
    }
}

// Message is received
messaging.peerSocket.onmessage = evt => {
    console.log(`App received: ${JSON.stringify(evt)}`);
    if (evt.data.key === "backgroundColor" && evt.data.newValue) {
        let backgroundColor = JSON.parse(evt.data.newValue);
        background.style.fill = backgroundColor;
    }
    if (evt.data.key === "sliderWorking" && evt.data.newValue) {
        workingTime = JSON.parse(evt.data.newValue);
    }
    if (evt.data.key === "sliderResting" && evt.data.newValue) {
        restingTime = JSON.parse(evt.data.newValue);
    }
    if (evt.data.key === "workArcColor" && evt.data.newValue) {
        let workArcColor = JSON.parse(evt.data.newValue);
        workArc.style.fill = workArcColor;
        buttonPlay.style.fill = workArcColor;
    }
    if (evt.data.key === "restArcColor" && evt.data.newValue) {
        let restArcColor = JSON.parse(evt.data.newValue);
        restArc.style.fill = restArcColor;
        buttonPause.style.fill = restArcColor;
    }
    if (evt.data.key === "textColor" && evt.data.newValue) {
        let textColor = JSON.parse(evt.data.newValue);
        workOrRest.style.fill = textColor;
        timeLeft.style.fill = textColor;
        buttonReset.style.fill = textColor;
        buttonForward.style.fill = textColor;
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