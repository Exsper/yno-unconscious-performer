// ==UserScript==
// @name         YNOproject Collective Unconscious Kalimba Performer
// @name:zh-CN   YNOproject Collective Unconscious 卡林巴演奏家
// @namespace    https://github.com/Exsper/
// @version      0.0.1
// @description  Music can be played automatically based on the given score.
// @description:zh-CN  可以根据给定乐谱自动演奏乐曲。
// @author       Exsper
// @homepage     https://github.com/Exsper/yno-unconscious-performer#readme
// @supportURL   https://github.com/Exsper/yno-unconscious-performer/issues
// @match        https://ynoproject.net/unconscious/
// @require      https://cdn.staticfile.org/jquery/2.1.3/jquery.min.js
// @license      MIT License
// @grant        none
// @run-at       document-end
// ==/UserScript==

let nowGroup = "";
let isLoop = false;
let stopped = true;

function getKeyData(code) {
    switch (code) {
        case "C3": return { group: "left", key: "Digit1", keyCode: 49 };
        case "C#3": return { group: "left", key: "Digit2", keyCode: 50 };
        case "D3": return { group: "left", key: "Digit3", keyCode: 51 };
        case "D#3": return { group: "left", key: "Digit4", keyCode: 52 };
        case "E3": return { group: "left", key: "Digit5", keyCode: 53 };
        case "F3": return { group: "left", key: "Digit6", keyCode: 54 };
        case "F#3": return { group: "left", key: "Digit7", keyCode: 55 };
        case "G3": return { group: "left", key: "Digit8", keyCode: 56 };
        case "G#3": return { group: "left", key: "Digit9", keyCode: 57 };
        case "A3": return { group: "left", key: "Digit0", keyCode: 48 };
        case "A#3": return { group: "left", key: "BracketLeft", keyCode: 219 };
        case "B3": return { group: "left", key: "BracketRight", keyCode: 221 };
        case "C4": return { group: "down", key: "Digit1", keyCode: 49 };
        case "C#4": return { group: "down", key: "Digit2", keyCode: 50 };
        case "D4": return { group: "down", key: "Digit3", keyCode: 51 };
        case "D#4": return { group: "down", key: "Digit4", keyCode: 52 };
        case "E4": return { group: "down", key: "Digit5", keyCode: 53 };
        case "F4": return { group: "down", key: "Digit6", keyCode: 54 };
        case "F#4": return { group: "down", key: "Digit7", keyCode: 55 };
        case "G4": return { group: "down", key: "Digit8", keyCode: 56 };
        case "G#4": return { group: "down", key: "Digit9", keyCode: 57 };
        case "A4": return { group: "down", key: "Digit0", keyCode: 48 };
        case "A#4": return { group: "down", key: "BracketLeft", keyCode: 219 };
        case "B4": return { group: "down", key: "BracketRight", keyCode: 221 };
        case "C5": return { group: "right", key: "Digit1", keyCode: 49 };
        case "C#5": return { group: "right", key: "Digit2", keyCode: 50 };
        case "D5": return { group: "right", key: "Digit3", keyCode: 51 };
        case "D#5": return { group: "right", key: "Digit4", keyCode: 52 };
        case "E5": return { group: "right", key: "Digit5", keyCode: 53 };
        case "F5": return { group: "right", key: "Digit6", keyCode: 54 };
        case "F#5": return { group: "right", key: "Digit7", keyCode: 55 };
        case "G5": return { group: "right", key: "Digit8", keyCode: 56 };
        case "G#5": return { group: "right", key: "Digit9", keyCode: 57 };
        case "A5": return { group: "right", key: "Digit0", keyCode: 48 };
        case "A#5": return { group: "right", key: "BracketLeft", keyCode: 219 };
        case "B5": return { group: "right", key: "BracketRight", keyCode: 221 };

        case "0": return null;
        default: return null;
    }
}

function switchToGroup(group) {
    switch (group) {
        case "left": return simulateKeyboardInput("ArrowLeft", 37);
        case "down": return simulateKeyboardInput("ArrowDown", 40);
        case "right": return simulateKeyboardInput("ArrowRight", 39);
        // case "up": return simulateKeyboardInput("ArrowUp",38);
        default: return;
    }
}

function playSingleKey(group, key, code) {
    if (nowGroup !== group) {
        nowGroup = group;
        switchToGroup(nowGroup);
    }
    simulateKeyboardInput(key, code);
}


function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function playSong(song, bpm) {
    let bpmnum = parseFloat(bpm);
    if (bpmnum <= 10 || bpmnum > 1200) bpmnum = 60;
    let interval = 60 / bpmnum * 1000;
    let keys = song.split(" ");
    stopped = false;
    for (let i = 0; i < keys.length; i++) {
        let keyData = getKeyData(keys[i]);
        if (keyData != null) {
            playSingleKey(keyData.group, keyData.key, keyData.keyCode);
        }
        if (stopped) break;
        await wait(interval);
    }
    if (stopped) {
        $("#rs-play").text("开始演奏");
        return;
    };
    if (isLoop) await playSong(song, bpm);
    else {
        stopped = true;
        $("#rs-play").text("开始演奏");
    }
}

// test
// playSong("F#4 A#3 0 0 F#4 A#3 0 0 F4 A#3 0 0 F4 A#3 0 0 F4 C#4 0 0 F4 C#4 0 0 C#4 A#3 0 0 C#4 A#3 0 0", 81.6)

function init() {
    let $openButton = $('<button>', { text: "+", id: "rs-open", style: "float:left;top:30%;position:absolute;left:0%;", title: "显示窗口" }).appendTo($("body"));
    $openButton.click(() => {
        $("#rs-div").show();
        $("#rs-open").hide();
    });
    let $mainDiv = $("<div>", { id: "rs-div", class: "container", style: "top:40%;left:0%;transform: translate(0, -50%);width:200px;position:absolute;text-align:center;z-index:999;height:auto;max-height:70vh;min-height:160px;overflow:hidden;border-top: 24px double #000000 !important;padding-top: 0px !important;" });
    $mainDiv.hide();
    let $statLabel = $("<span>", { id: "rs-stat", text: "请在使用卡林巴效果并打开钢琴窗后点击“开始演奏”", style: "display: block; padding: 6px;" }).appendTo($mainDiv);
    let $songText = $("<textarea>", { id: "rs-song", val: "F#4 A#3 0 0 F#4 A#3 0 0 F4 A#3 0 0 F4 A#3 0 0 F4 C#4 0 0 F4 C#4 0 0 C#4 A#3 0 0 C#4 A#3 0 0", style: "min-height: 80px;" }).appendTo($mainDiv);
    $("<span>", { text: "BPM: " }).appendTo($mainDiv);
    let $numBox = $("<input>", { type: "text", id: "rs-bpm", val: "81.6", style: "width:30px;align-self:center;" }).appendTo($mainDiv);
    let $checkButton = $('<button>', { type: "button", text: "开始演奏", id: "rs-play", style: "width:fit-content;align-self:center;" }).appendTo($mainDiv);
    $checkButton.click(async () => {
        if (stopped) {
            stopped = false;
            $checkButton.text("停止演奏");
            await playSong($songText.val(), $numBox.val());
        }
        else {
            stopped = true;
            $checkButton.text("开始演奏");
        }
    });
    let $titleDiv = $("<div>", { id: "rs-title", style: "width: 100%; display: flex;" }).prependTo($mainDiv);
    let $rightDiv = $("<div>", { id: "rs-title-right", style: "display: flex; justify-content: right;" }).prependTo($titleDiv);
    let $leftDiv = $("<div>", { id: "rs-title-left", style: "width: 100%; display: flex; justify-content: left;" }).prependTo($titleDiv);
    let $loopCheckBox = $("<input>", { type: "checkbox", id: "rs-loop" }).appendTo($leftDiv);
    $("<label>").attr({ for: "rs-loop" }).text("循环演奏").appendTo($leftDiv);
    $loopCheckBox.change(() => {
        if ($loopCheckBox.prop("checked")) {
            isLoop = true;
        } else {
            isLoop = false;
        }
    });
    let $closeButton = $('<button>', { text: "-", id: "rs-close", title: "隐藏窗口" }).appendTo($rightDiv);
    $closeButton.click(() => {
        $("#rs-div").hide();
        $("#rs-open").show();
    });
    $mainDiv.appendTo($("body"));
}



function check() {
    let $loaded = $("#loadingOverlay.loaded");
    if ($loaded.length > 0) {
        init();
    }
    else setTimeout(function () { check(); }, 2000);
}

$(document).ready(() => {
    check();
});