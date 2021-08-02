
let existingDataconn = null;
const signalingurl = 'wss://ayame-labo.shiguredo.jp/signaling';
let dataChannel = null;
var isConnect = true;
function DataConnect(theirId) {
    var options;
    options = Ayame.defaultOptions;
    options.video.codec = 'VP9';
    options.video.direction = 'recvonly';
    options.audio.direction = 'recvonly';
    options.signalingKey = 'YxBUizkGKEg-ydXX_M4C1ILrP606cTJKBfN-0DHdaUCdrILQ';
    const startConn = async () => {
        const conn = Ayame.connection(signalingurl, 'rabbit-go@data', options, true);
        existingDataconn = conn;
        await conn.connect(null);
        conn.on('open', async (e) => {
            dataChannel = await conn.createDataChannel('dataChannel');
            dataChannel.onmessage = (e) => {
                console.log('data received: ', e.data);
            };
        });
        conn.on('connect', (e) => { isConnect = true; });
        conn.on('disconnect', (e) => {
            console.log(e);
            existingDataconn = null;
        });
    };
    startConn();
}
function DataClose() {
    if (existingDataconn != null) {
        existingDataconn.close();
    }
}
//送信処理
function DataSend(msg) {
    if (dataChannel == null) return;
    if (!isConnect) return;
    dataChannel.send(msg);
}
function DataReceived() {
}


