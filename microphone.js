/**
 * 
 */
class Microphone {
  constructor() {
    this.initialized = false;
    navigator.mediaDevices.getUserMedia({audio:true})
    .then( function(stream) {
    	this.audioContext = new AudioContext(); //allow us to generate, play and analyse audio
			this.microphone = this.audioContext.createMediaStreamSource(stream); //takes raw media stream i.e. microphone input for now and convert it into audio nodes
			this.analyser = this.audioContext.createAnalyser(); //creates analyser nodes, whic can be used to expose audio time and frequency data to create visualizations
			this.analyser.fftSize = 512; //fast Fourier transform to slice the audio into equal no of samples called bins
			const bufferLength = this.analyser.frequencyBinCount; //half of fft size value
			this.dataArray = new Uint8Array(bufferLength); //convert audio into 8 bits array
			this.microphone.connect(this.analyser); //direct the audio data into aanalyser node
			this.initialized = true;
    }.bind(this)) //sends this context to the provided value
		.catch((error) => {
			alert(error);
		})
  }

	getSamples() {
		this.analyser.getByteTimeDomainData(this.dataArray); //copies the current waveform or time domain data into Uint8Array
		let normSamples = [...this.dataArray].map(e => e/128 -1); //normalize between -1 to 1
		return normSamples;
	}

	getVolumes() {
		this.analyser.getByteTimeDomainData(this.dataArray);
		let normSamples = [...this.dataArray].map(e => e/128 -1);
		let sum = 0;
		for (let i = 0; i < normSamples.length; i++) {
			sum += normSamples[i] * normSamples[i];
		}
		let volume = Math.sqrt(sum / normSamples.length); //mean square method
		return volume;
	}
}

const microphone = new Microphone();