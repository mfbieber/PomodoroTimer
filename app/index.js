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
const workBackground = document.getElementById("workBackground");
const restBackground = document.getElementById("restBackground");

let workingTime;
let restingTime;
let working = false;
let resting = false;
let workCount = 0;
let restCount = 0;

workOrRest.text = 'press start!';
clock.granularity = "seconds";
clock.ontick = evt => {
    if (working) {
        workOrRest.text = 'work!';
        if (workCount > workingTime) {
            resting = true;
            workCount = 0;
            working = false;
        }
        if (workCount <= workingTime) {
            workArc.sweepAngle = workCount * (workBackground.sweepAngle - 2) / workingTime;
            timeLeft.text = (workingTime - workCount).toString() + ' s';
            workCount++;
        }
    }
    if (resting) {
        workOrRest.text = 'rest!';
        if (restCount > restingTime) {
            restCount = 0;
            resting = false;
            restArc.sweepAngle = restBackground.sweepAngle -2;
            restArc.startAngle = 3;
            workOrRest.text = 'press start!';
        }
        if (restCount <= restingTime) {
            restArc.sweepAngle = (restBackground.sweepAngle - 2) * (1 - restCount/restingTime);
            restArc.startAngle = 3 +  (restBackground.sweepAngle - 2) * restCount/restingTime;
            timeLeft.text = (restingTime - restCount).toString() + ' s';
            restCount++;
        }
    }
};
buttonReset.onactivate = evt => {
    working = false;
    workCount = 0;
    resting = false;
    restCount = 0;
    workOrRest.text = 'press start!';
    restArc.sweepAngle = restBackground.sweepAngle -2;
    restArc.startAngle = 3;
    workArc.sweepAngle = 0;
};
buttonForward.onactivate = evt => {
    if (working) {
        working = false;
        workOrRest.text = 'rest!';
        restArc.sweepAngle = restBackground.sweepAngle -2;
        restArc.startAngle = 3;
        resting = true;
    } else {
        working = true;
        workCount = 0;
        workArc.sweepAngle = 0;
        workOrRest.text = 'work!';
        restArc.sweepAngle = restBackground.sweepAngle -2;
        restArc.startAngle = 3;
        resting = false;
    }
};
buttonPlay.onactivate = evt => {
    if (!working) {
        working = true;
        workOrRest.text = 'work!';
    }
};
buttonPause.onactivate = evt => {
    if(working) {
        working = false;
        workOrRest.text = 'rest!';
        resting = true;
    }
};

let updateArcs = () => {
    workBackground.sweepAngle = (workingTime / (workingTime + restingTime)) * 360 - 2;
    restBackground.sweepAngle = (restingTime / (workingTime + restingTime)) * 360 - 2;
    workBackground.startAngle = restBackground.sweepAngle + 4;
    workArc.startAngle = workBackground.startAngle + 1;
    restArc.sweepAngle = restBackground.sweepAngle -2;
}

// Message is received
messaging.peerSocket.onmessage = evt => {
    console.log(`App received: ${JSON.stringify(evt)}`);
    if (evt.data.key === "backgroundColor" && evt.data.newValue) {
        background.style.fill = JSON.parse(evt.data.newValue);
    }
    if (evt.data.key === "sliderWorking" && evt.data.newValue) {
        workingTime = JSON.parse(evt.data.newValue);
        updateArcs();
    }
    if (evt.data.key === "sliderResting" && evt.data.newValue) {
        restingTime = JSON.parse(evt.data.newValue);
        updateArcs();
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