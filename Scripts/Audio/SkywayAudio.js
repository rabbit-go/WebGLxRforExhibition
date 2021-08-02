'use strict';
let AudioPeer = null;
var roomMode = 'mesh';

async function MakeCallAudio(calltoid) {
    let stream = null;
    let room = MakeAudioRoom(calltoid, stream);
    CallEventSubscribe(calltoid, room);
}


//発信処理
function MakeAudioRoom(calltoid, localStream) {
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
var streams = new Array(4);
function CallAudioEventSubscribe(id, room) {

    room.on('stream', async stream => {
        if(stream==null)return;
        //forward left back right
        stream.getTracks().forEach((track, index) => {
            const tmpStream = new MediaStream([track]);
            streams[index] = tmpStream;
        });
        Create4DirectionAudio(streams);
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
//切断処理
function EndAudioCall() {
    if (AudioPeer) AudioPeer.close();
}
