import document from "document";
import * as messaging from "messaging";
import clock from "clock";
import { vibration } from "haptics";
import * as fs from "fs";

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

let working = false;
let resting = false;
let workCount = 0;
let restCount = 0;
let workingTime = 1500;
let restingTime = 300;
let backgroundColor = "#42113b";
let workArcColor = "#ae2c51";
let restArcColor = "#dc8331";
let textColor = "#87c5b4";

let exists = true;
try {
    fs.statSync("json.txt");
}
catch(error) {
    exists = false;
}

let loadSettings = () => {
    if (!exists) {
        let settings = {
            "backgroundColor": backgroundColor,
            "sliderWorking": workingTime,
            "sliderResting": restingTime,
            "workArcColor": workArcColor,
            "restArcColor": restArcColor,
            "textColor": textColor
        };
        fs.writeFileSync("json.txt", settings, "json");
        console.log('initialized settings file');
    }
    else {
        let jsonObject = fs.readFileSync("json.txt", "json");
        backgroundColor = jsonObject["backgroundColor"];
        workArcColor = jsonObject["workArcColor"];
        restArcColor = jsonObject["restArcColor"];
        workingTime = jsonObject["sliderWorking"];
        restingTime = jsonObject["sliderResting"];
        textColor = jsonObject["textColor"];
        console.log('read from settings file');
    };
}

let updateArcs = () => {
    workBackground.sweepAngle = (workingTime / (workingTime + restingTime)) * 360 - 2;
    restBackground.sweepAngle = (restingTime / (workingTime + restingTime)) * 360 - 2;
    workBackground.startAngle = restBackground.sweepAngle + 4;
    workArc.startAngle = workBackground.startAngle + 1;
    restArc.sweepAngle = restBackground.sweepAngle -2;
}
let updateStyle = () => {
    background.style.fill = backgroundColor;
    restArc.style.fill = restArcColor;
    workArc.style.fill = workArcColor;
    updateArcs();
    buttonPlay.style.fill = workArcColor;
    buttonPause.style.fill = restArcColor;
    workOrRest.style.fill = textColor;
    timeLeft.style.fill = textColor;
    buttonReset.style.fill = textColor;
    buttonForward.style.fill = textColor;
}

clock.granularity = "minutes";
clock.ontick = evt => {
    workOrRest.text = 'press start!';
    loadSettings();
};
let start = () => {
    setInterval(timer, 1000);
};
let timer = () => {
    if (working) {
        workOrRest.text = 'work!';
        if (workCount > workingTime) {
            vibration.start("nudge-max");
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
    start();
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
    start();
};
buttonPlay.onactivate = evt => {
    if (!working) {
        working = true;
        workOrRest.text = 'work!';
        resetRestSettings();
    }
    start();
};
buttonPause.onactivate = evt => {
    if(working) {
        working = false;
        resting = true;
        workOrRest.text = 'rest!';
        resetWorkSettings();
    }
    start();
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
    }
    if (evt.data.key === "sliderWorking" && evt.data.newValue) {
        workingTime = JSON.parse(evt.data.newValue) * 60;
    }
    if (evt.data.key === "sliderResting" && evt.data.newValue) {
        restingTime = JSON.parse(evt.data.newValue) * 60;
    }
    if (evt.data.key === "workArcColor" && evt.data.newValue) {
        workArcColor = JSON.parse(evt.data.newValue);
    }
    if (evt.data.key === "restArcColor" && evt.data.newValue) {
        restArcColor = JSON.parse(evt.data.newValue);
    }
    if (evt.data.key === "textColor" && evt.data.newValue) {
        textColor = JSON.parse(evt.data.newValue);
    }
    let settings = {
        "backgroundColor": backgroundColor,
        "sliderWorking": workingTime,
        "sliderResting": restingTime,
        "workArcColor": workArcColor,
        "restArcColor": restArcColor,
        "textColor": textColor
    };
    fs.writeFileSync("json.txt", settings, "json");
    console.log('updated settings file');
    updateStyle();
};