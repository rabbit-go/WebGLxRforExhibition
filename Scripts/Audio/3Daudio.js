
// Super version: http://chromium.googlecode.com/svn/trunk/samples/audio/simple.html
function startStream() {
    const peer = new Peer('client', { key: '829682c4-f853-4d97-8691-aa0c10064efd' });
    const streams = new Array(4);
    peer.on("open", x => {
        const roomRF = peer.joinRoom("micRF", { mode: "mesh", audioReceiveEnabled: true, videoReceiveEnabled: false, stream: null });
        const roomRB = peer.joinRoom("micRB", { mode: "mesh", audioReceiveEnabled: true, videoReceiveEnabled: false, stream: null });
        const roomLF = peer.joinRoom("micLF", { mode: "mesh", audioReceiveEnabled: true, videoReceiveEnabled: false, stream: null });
        const roomLB = peer.joinRoom("micLB", { mode: "mesh", audioReceiveEnabled: true, videoReceiveEnabled: false, stream: null });
        roomRF.on("stream", stream => {
            if (stream != null) {
                streams[0] = stream;
                StartDirectionAudio();
            }
        });
        roomRB.on("stream", stream => {
            if (stream != null) {
                streams[1] = stream;
                StartDirectionAudio();
            }

        });
        roomLF.on("stream", stream => {
            if (stream != null) {
                streams[2] = stream;
                StartDirectionAudio();
            }

        });
        roomLB.on("stream", stream => {
            if (stream != null) {
                streams[3] = stream;
                StartDirectionAudio();
            }

        });
    });
    function StartDirectionAudio(){
        for (let i = 0; i < streams.length; i++) {
            if(streams[i]==null){return;}
        }
        Create4DirectionAudio(streams);
    }
    var positionSample = new PositionSample();
    function Create4DirectionAudio(streams) {

        for (let i = 0; i < streams.length; i++) {
            var panner = positionSample.createPanner(streams[i]);
            let position = new Vector2(cos(90 + (90 * i)), sin(90 + (90 * i)))
            let angle = 180 + (90 * i);
            positionSample.changePosition(panner, position);
            positionSample.changeAngle(panner, angle);
        }
    }
    function setPosition(x, y) {
        context.listener.setPosition(x, y, 0);
    }
    function setOrientation(x, y) {
        myListener.setOrientation(x, y, 0, 0, 0, 1);
    }
    PositionSample.prototype.createPanner = function (stream) {
        // Hook up the audio graph for this sample.
        var source = document.audioContext.createMediaStreamSource(stream);
        var panner = document.audioContext.createPanner();
        panner.coneOuterGain = 0.1;
        panner.coneOuterAngle = 180;
        panner.coneInnerAngle = 0;
        // Set the panner node to be at the origin looking in the +x
        // direction.
        panner.connect(context.destination);
        source.connect(panner);
        source.start(0);
        // Position the listener at the origin.
        context.listener.setPosition(0, 0, 0);
        return panner;
    }

    PositionSample.prototype.createStereoPanner = async function (stream) {
        // Hook up the audio graph for this sample.
        var source = document.audioContext.createMediaStreamSource(stream);
        var data = await document.audioContext.decodeAudioData(someStereoBuffer);
        var sourceL = ac.createBufferSource();
        var sourceR = ac.createBufferSource();
        sourceL.buffer = data;
        sourceR.buffer = data;
        var splitter = ac.createChannelSplitter(2);
        sourceL.connect(splitter);
        var merger = ac.createChannelMerger(2);
        
        // 左チャンネルのボリュームのみ小さくする
        var gain = ac.createGain();
        gain.value = 0.5;
        splitter.connect(gain, 0);

        // splitterをmergerの2番目の入力にして戻す
        // ここではチャンネルを入れ替えることで、ステレオ音声の左右を逆にしている
        gain.connect(merger, 0, 1);
        splitter.connect(merger, 1, 0);

        var dest = ac.createMediaStreamDestination();

        // ChannelMergerNodeを使ったのでステレオのMediaStreamとなった
        // webオーディオグラフのWebRTCやMediaRecorderなどに渡す
        merger.connect(dest);



        var panner = document.audioContext.createPanner();
        panner.coneOuterGain = 0.1;
        panner.coneOuterAngle = 180;
        panner.coneInnerAngle = 0;
        // Set the panner node to be at the origin looking in the +x
        // direction.
        panner.connect(context.destination);
        source.connect(panner);
        source.start(0);
        // Position the listener at the origin.
        context.listener.setPosition(0, 0, 0);
        return panner;
    }

    PositionSample.prototype.changePosition = function (panner, position) {
        // Position coordinates are in normalized canvas coordinates
        // with -0.5 < x, y < 0.5
        if (position) {
            if (!this.isPlaying) {
                this.play();
            }
            panner.setPosition(position.x, position.y, -0.5);
        } else {
            this.stop();
        }
    };

    PositionSample.prototype.changeAngle = function (panner, angle) {
        //  console.log(angle);
        // Compute the vector for this angle.
        panner.setOrientation(Math.cos(angle), -Math.sin(angle), 1);
    };
