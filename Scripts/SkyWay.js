'use strict';
let peer = null;
let existingLeftCall = null;
let existingRightCall = null;
const receiveOnly = true;    //受信専用かどうか
const VIDEO_CODEC = 'VP9';
var roomMode = 'sfu';
function ChangeRoomMode(mode) {
    roomMode = mode;
}
//peeridを取得 
function GetPeerId(yourid) {
    //peerオブジェクトの作成
    peer = new Peer(yourid, {
        key: '829682c4-f853-4d97-8691-aa0c10064efd',    //APIkey
        debug: 3
    });
}
function GetPersonList(id) {
    var element = document.getElementById(id);
    element.innerText = "";
    if (existingLeftCall == null) return;
    if (existingLeftCall.members == null) return;
    var i = 0;
    existingLeftCall.members.forEach(menber => {
        i++;
        element.innerText = i + '人';
    });
}

async function MakeCallLeft(calltoid) {
    let stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true }, video: false });
    let room = MakeRoom(calltoid, stream);
    if (existingLeftCall) {
        existingLeftCall.close();
    }
    existingLeftCall = room;
    CallEventSubscribe('LeftEye-video', room);
}
function MakeCallRight(calltoid) {
    let room = MakeRoom(calltoid, null);
    if (existingRightCall) {
        existingRightCall.close();
    };
    existingRightCall = room;
    CallEventSubscribe('RightEye-video', room);
}

//切断処理
function EndCall() {
    if (existingLeftCall) existingLeftCall.close();
    if (existingRightCall) existingRightCall.close();
}
//発信処理
function MakeRoom(calltoid, localStream) {
    if (peer == null) {
        GetPeerId();
    }
    const room = peer.joinRoom(calltoid, {
        mode: roomMode,
        stream: localStream,
        videoCodec: VIDEO_CODEC,
        videoReceiveEnabled: receiveOnly,                 //受信専用としてここで設定
        videoBandWidth: 20000,
    });
    return room;
}
function CallEventSubscribe(id, room) {
    room.on('stream', function (stream) {
        if (!stream.peerId.includes('tc')) {
            let element = document.createElement('audio');
            element.setAttribute('id', stream.peerId + 'audio');
            element.srcObject = stream;
            document.body.appendChild(element);
            return;
        }
        let video = document.getElementById(id);
        video.srcObject = stream;
    });

    room.on('close', function () {
        if (!stream.peerId.includes('tc')) {
            let element = document.getElementById(stream.peerId + 'audio');
            element.remove();
        }
        let video = document.getElementById(id);
        video.srcObject = undefined;
    });
}
