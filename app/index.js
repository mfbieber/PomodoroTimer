import document from "document";
import * as messaging from "messaging";
import clock from "clock";
import { vibration } from "haptics";

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

let workingTime = 25;
let restingTime = 5;
let working = false;
let resting = false;
let workCount = 0;
let restCount = 0;
let textColor = "#87c5b4";
let restArcColor = "#dc8331";
let workArcColor = "#ae2c51";
let backgroundColor = "#42113b";

clock.granularity = "seconds";
clock.ontick = evt => {start()};
workOrRest.text = 'press start!';
let start = () => {setInterval(timer(), 1000);};
let timer = () => {
    if (working) {
        workOrRest.text = 'work!';
        if (workCount > workingTime) {
            vibration.start("bump");
            resting = true;
            workCount = 0;
            working = false;
        }
        if (workCount <= workingTime) {
            workArc.sweepAngle = workCount * (workBackground.sweepAngle - 2) / workingTime;
            timeLeft.text = convertSecondsToMinutesAndSeconds(workingTime - workCount);
            workCount++;
        }
    }
    if (resting) {
        workOrRest.text = 'rest!';
        if (restCount > restingTime) {
            vibration.start("bump");
            resetRestSettings();
            resetWorkSettings();
            workOrRest.text = 'press start!';
        }
        if (restCount <= restingTime) {
            restArc.sweepAngle = (restBackground.sweepAngle - 2) * (1 - restCount/restingTime);
            restArc.startAngle = 3 +  (restBackground.sweepAngle - 2) * restCount/restingTime;
            timeLeft.text = convertSecondsToMinutesAndSeconds(restingTime - restCount);
            restCount++;
        }
    }
};
buttonReset.onactivate = evt => {
    resetRestSettings();
    resetWorkSettings();
    workOrRest.text = 'press start!';
    timeLeft.text = '';
};
buttonForward.onactivate = evt => {
    if (working) {
        resetRestSettings();
        resetWorkSettings();
        resting = true;
        workOrRest.text = 'rest!';
    } else {
        resetRestSettings();
        resetWorkSettings();
        working = true;
        workOrRest.text = 'work!';
    }
};
buttonPlay.onactivate = evt => {
    if (!working) {
        working = true;
        workOrRest.text = 'work!';
        resetRestSettings();
    }
};
buttonPause.onactivate = evt => {
    if(working) {
        working = false;
        resting = true;
        workOrRest.text = 'rest!';
        resetWorkSettings();
    }
};

let resetWorkSettings = () => {
    workCount = 0;
    working = false;
    workArc.sweepAngle = 0;
}

let resetRestSettings = () => {
    restCount = 0;
    resting = false;
    restArc.sweepAngle = restBackground.sweepAngle -2;
    restArc.startAngle = 3;
}

let updateArcs = () => {
    workBackground.sweepAngle = (workingTime / (workingTime + restingTime)) * 360 - 2;
    restBackground.sweepAngle = (restingTime / (workingTime + restingTime)) * 360 - 2;
    workBackground.startAngle = restBackground.sweepAngle + 4;
    workArc.startAngle = workBackground.startAngle + 1;
    restArc.sweepAngle = restBackground.sweepAngle -2;
}

let convertSecondsToMinutesAndSeconds = (time) => {
    let minutes = Math.floor(time/60);
    var seconds = time - minutes*60;
    return (minutes < 10 ? "0" : "") + minutes.toString() + ':' + (seconds < 10 ? "0" : "") + seconds.toString();
}

// Message is received
messaging.peerSocket.onmessage = evt => {
    console.log(`App received: ${JSON.stringify(evt)}`);
    if (evt.data.key === "backgroundColor" && evt.data.newValue) {
        backgroundColor = JSON.parse(evt.data.newValue);
        background.style.fill = backgroundColor;
    }
    if (evt.data.key === "sliderWorking" && evt.data.newValue) {
        workingTime = JSON.parse(evt.data.newValue) * 60;
        updateArcs();
    }
    if (evt.data.key === "sliderResting" && evt.data.newValue) {
        restingTime = JSON.parse(evt.data.newValue) * 60;
        updateArcs();
    }
    if (evt.data.key === "workArcColor" && evt.data.newValue) {
        workArcColor = JSON.parse(evt.data.newValue);
        workArc.style.fill = workArcColor;
        buttonPlay.style.fill = workArcColor;
    }
    if (evt.data.key === "restArcColor" && evt.data.newValue) {
        restArcColor = JSON.parse(evt.data.newValue);
        restArc.style.fill = restArcColor;
        buttonPause.style.fill = restArcColor;
    }
    if (evt.data.key === "textColor" && evt.data.newValue) {
        textColor = JSON.parse(evt.data.newValue);
        workOrRest.style.fill = textColor;
        timeLeft.style.fill = textColor;
        buttonReset.style.fill = textColor;
        buttonForward.style.fill = textColor;
    }
};