'use strict';
let peer = null;
let existingLeftCall = null;
let existingRightCall = null;
const receiveOnly = true;    //受信専用かどうか
const VIDEO_CODEC = 'VP9';
const signalingurl = 'wss://ayame-labo.shiguredo.jp/signaling';
function CreateVideoElement(id) {
    let s = document.createElement("video");
    s.setAttribute('id', id);
    s.setAttribute('width', '1920px');
    s.setAttribute('height', '1080px');
    document.body.appendChild(s);
    s.setAttribute('autoplay', '');
    s.setAttribute('muted', '');
   // s.style.display = 'none';
    s.style.position = 'relative';
    s.style.top = '2000px';
    s.style.left = '150px';
}
var S = "0123456789";
var options;
function MakeCallLeft() {
    options = Ayame.defaultOptions;
    options.video.codec = 'VP9';
    options.video.direction = 'recvonly';
    options.audio.direction = 'recvonly';
    options.signalingKey = 'YxBUizkGKEg-ydXX_M4C1ILrP606cTJKBfN-0DHdaUCdrILQ';
    const startConn = async () => {
        const conn = Ayame.connection(signalingurl, 'rabbit-go@left', options, true);
        existingLeftCall = conn;
        await conn.connect(null);
        conn.on('disconnect', (e) => {
            console.log(e);
            existingLeftCall = null;
        });
        conn.on('addstream', (e) => {
            document.getElementById('LeftEye-video').srcObject = e.stream;
        });
    };
    startConn();

}
function MakeCallRight() {
    options = Ayame.defaultOptions;
    options.video.direction = 'recvonly';
    options.audio.direction = 'recvonly';
    options.signalingKey = 'YxBUizkGKEg-ydXX_M4C1ILrP606cTJKBfN-0DHdaUCdrILQ';
    const startConn = async () => {
        const conn = Ayame.connection(signalingurl, 'rabbit-go@ri', options, true);
        existingRightCall = conn;
        await conn.connect(null);
        conn.on('disconnect', (e) => {
            console.log(e);
            existingRightCall = null;
        });
        conn.on('addstream', (e) => {
            document.getElementById('RightEye-video').srcObject = e.stream;
        });
    };
    startConn();
}

//切断処理
function EndCall() {
    if (existingLeftCall) existingLeftCall.disconnect();
    if (existingRightCall) existingRightCall.disconnect();
}
