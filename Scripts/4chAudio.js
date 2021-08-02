
streamInit();
function streamInit() {
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	document.audioContext = new AudioContext({ sampleRate: 16000 });

	setInterval(function () {
		if (document.audioContext.state === "suspended" || document.audioContext.state === "interrupted") {
			console.log("resuming audioContext. state: " + document.audioContext.state);
			document.audioContext.resume();
		}
	}, 500);
}

function startStream() {
	const peer = new Peer('client', { key: '829682c4-f853-4d97-8691-aa0c10064efd' });
	const streams = new Array(2);
	peer.on("open", x => {
		const roomLR = peer.joinRoom("micLR", { mode: "mesh", audioReceiveEnabled: true, videoReceiveEnabled: false, stream: null });
		const roomFB = peer.joinRoom("micFB", { mode: "mesh", audioReceiveEnabled: true, videoReceiveEnabled: false, stream: null });
		roomLR.on("stream", stream => {
			if (stream != null) {
				streams[0] = stream;
				GetUserMediaSuccessLR(stream);
			}
		});
		roomFB.on("stream", stream => {
			if (stream != null) {
				streams[1] = stream;
				GetUserMediaSuccessFB(stream);
			}

		});
	});


	async function GetUserMediaSuccessLR(stream) {

		var source = document.audioContext.createMediaStreamSource(stream);
		var script_processor_node = document.audioContext.createScriptProcessor(4096, 2, 2);
		script_processor_node.onaudioprocess = MicrophoneProcessLR;
		script_processor_node.connect(document.audioContext.destination);
		source.connect(script_processor_node);
	}
	function GetUserMediaSuccessFB(stream) {
		var microphone_stream = document.audioContext.createMediaStreamSource(stream);
		var script_processor_node = document.audioContext.createScriptProcessor(4096, 2, 2);
		script_processor_node.onaudioprocess = MicrophoneProcessFB;
		script_processor_node.connect(document.audioContext.destination);
		microphone_stream.connect(script_processor_node);
	}
	function SpeakerDataSend(channnelData, gameObjectName) {
		var stringArray = "";
		for (var i = 0; i < channnelData.length; i++) {
			stringArray = stringArray + channnelData[i];
			if (i < channnelData.length - 1) {
				stringArray = stringArray + ",";
			}
		}
		unityInstance.SendMessage(gameObjectName, 'WriteBufferFromMicrophoneHandler', stringArray);
	}
	function MicrophoneProcessLR(event) {
		if (event.inputBuffer.sampleRate === 16000) {
			SpeakerDataSend(event.inputBuffer.getChannelData(0), 'Speakers/SpeakerL');
			SpeakerDataSend(event.inputBuffer.getChannelData(1), 'Speakers/SpeakerR');

		} else {
			Resample(event.inputBuffer, 'Speakers/SpeakerL', 'Speakers/SpeakerR', 16000);
		}
	}
	function MicrophoneProcessFB(event) {
		if (event.inputBuffer.sampleRate === 16000) {
			SpeakerDataSend(event.inputBuffer.getChannelData(0), 'Speakers/SpeakerF');
			SpeakerDataSend(event.inputBuffer.getChannelData(1), 'Speakers/SpeakerB');
		}
		else {
			Resample(event.inputBuffer, 'Speakers/SpeakerF', 'Speakers/SpeakerB', 16000);
		}
	}

	function Resample(sourceAudioBuffer, targetObjectName0, targetObjectName1, TARGET_SAMPLE_RATE) {
		var OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
		var offlineCtx = new OfflineAudioContext(sourceAudioBuffer.numberOfChannels, sourceAudioBuffer.duration * sourceAudioBuffer.numberOfChannels * TARGET_SAMPLE_RATE, TARGET_SAMPLE_RATE);
		var buffer = offlineCtx.createBuffer(sourceAudioBuffer.numberOfChannels, sourceAudioBuffer.length, sourceAudioBuffer.sampleRate);
		// Copy the source data into the offline AudioBuffer
		for (var channel = 0; channel < sourceAudioBuffer.numberOfChannels; channel++) {
			buffer.copyToChannel(sourceAudioBuffer.getChannelData(channel), channel);
		}
		// Play it from the beginning.
		var source = offlineCtx.createBufferSource();
		source.buffer = sourceAudioBuffer;
		source.connect(offlineCtx.destination);
		source.start(0);
		offlineCtx.oncomplete = function (e) {
			// `resampled` contains an AudioBuffer resampled at 16000Hz.
			// use resampled.getChannelData(x) to get an Float32Array for channel x.
			var resampled = e.renderedBuffer;
			var leftFloat32Array = resampled.getChannelData(0);
			SpeakerDataSend(leftFloat32Array, targetObjectName0);
			leftFloat32Array = resampled.getChannelData(1);
			SpeakerDataSend(leftFloat32Array, targetObjectName1);
		}
		offlineCtx.startRendering();
	}
}

function endStream() {
	if (document.microphone_stream != undefined) {
		document.microphone_stream.disconnect(document.script_processor_node);
		document.script_processor_node.disconnect();
	}

	document.microphone_stream = null;
	document.script_processor_node = null;

	document.isRecording = 0;

	console.log('record ended');
}
function isRecording() {
	if (document.isRecording == undefined)
		document.isRecording = 0;
	return document.isRecording;
}
