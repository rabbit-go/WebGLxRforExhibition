const channelId = 'rabbit-go@sora-labo-multi-sample';
const debug = false;
const sora = Sora.connection('wss://sora-labo.shiguredo.jp/signaling', debug);
const options = {
    multistream: true
}
let sendrecv1;
let sendrecv2;
function GetPeerId(channelId) {
    sendrecv1 = sora.sendrecv(channelId, null, options);
    sendrecv2 = sora.sendrecv(channelId, null, options);
    sendrecv1.metadata = {
        'signaling_key': 'k9eVLAMOzNGKUy0SbmjJgsho8Dh7afWvpc2AF1KDb3av86jY'
    };
    sendrecv2.metadata = {
        'signaling_key': 'k9eVLAMOzNGKUy0SbmjJgsho8Dh7afWvpc2AF1KDb3av86jY'
    };
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

async function MakeCallLeft(id) {
    CallEventSubscribe(id);
}
function MakeCallRight(id) {
    CallEventSubscribe(id);
}

//切断処理
function EndCall() {
    sendrecv1.disconnect()
        .then(function () {
        });
    sendrecv2.disconnect()
        .then(function () {
        });
}
function CallEventSubscribe(id, soraConnection) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(mediaStream => {
            soraConnection.connect(mediaStream);
        })
        .catch(e => {
            console.error(e);
        });
    soraConnection.on('track', function (event) {
        const stream = event.streams[0];
        const mediaStreamTracks = stream.getVideoTracks();
        if (!stream) return;
        if (mediaStreamTracks.length == 0) {
            const element = document.createElement('audio');
            element.setAttribute("autoplay", "");
            element.srcObject = stream;
        }
        const remoteVideo = document.getElementById(id);
        remoteVideo.srcObject = stream;
    });
}
