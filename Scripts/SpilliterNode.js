class WhiteNoiseProcessor extends AudioWorkletProcessor {
  process (inputs, outputs, parameters) {
    const input = inputs[0]
    input.forEach(channel => {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = Math.random() * 2 - 1
      }
    })
    return true
  }
   Resample(sourceAudioBuffer, targetObjectName0, targetObjectName1, TARGET_SAMPLE_RATE) {
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
