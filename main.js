/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!
import * as audio from './audio.js';
import * as utils from './utils.js';
import * as canvas from './canvas.js';

const drawParams = {
    
    showGradient: true,
    showBars: true,
    showLines: true,
    showCircles: false,
    showNoise: false,
    showInvert: false,
    showEmboss: false
    
}

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

function init(){
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    audio.setupWebaudio(DEFAULTS.sound1);
    
    console.log(audio);
    
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);
    //getAudioContext().resume();
    loop();
}

function loop(){
/* NOTE: This is temporary testing code that we will delete in Part II */
	requestAnimationFrame(loop);
    
    canvas.draw(drawParams);
	// 1) create a byte array (values of 0-255) to hold the audio data
	// normally, we do this once when the program starts up, NOT every frame
    /*
	let audioData = new Uint8Array(audio.analyserNode.fftSize/2);
	
	// 2) populate the array of audio data *by reference* (i.e. by its address)
	audio.analyserNode.getByteFrequencyData(audioData);
	
	// 3) log out the array and the average loudness (amplitude) of all of the frequency bins
		console.log(audioData);
		
		console.log("-----Audio Stats-----");
		let totalLoudness =  audioData.reduce((total,num) => total + num);
		let averageLoudness =  totalLoudness/(audio.analyserNode.fftSize/2);
		let minLoudness =  Math.min(...audioData); // ooh - the ES6 spread operator is handy!
		let maxLoudness =  Math.max(...audioData); // ditto!
		// Now look at loudness in a specific bin
		// 22050 kHz divided by 128 bins = 172.23 kHz per bin
		// the 12th element in array represents loudness at 2.067 kHz
		let loudnessAt2K = audioData[11]; 
		console.log(`averageLoudness = ${averageLoudness}`);
		console.log(`minLoudness = ${minLoudness}`);
		console.log(`maxLoudness = ${maxLoudness}`);
		console.log(`loudnessAt2K = ${loudnessAt2K}`);
		console.log("---------------------");
      */  
}

function setupUI(canvasElement){
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };

    playButton.onclick = e => {
        
        console.log(`audioCtx.state before = ${audio.audioCtx.state}`);
        
        //check if context is in suspended state
        if(audio.audioCtx.state == "suspended"){
            
            audio.audioCtx.resume();
            
        }
        console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
        
        if(e.target.dataset.playing == "no"){
            console.log("here");
            //if track is currently paused, play it
            audio.playCurrentSound();
            e.target.dataset.playing="yes";//our css will set the text to pause
            //if track is playing puase it
        }
        else{
            
            audio.pauseCurrentSound();
            e.target.dataset.playing= "no";//our css will set the text to play
            
        }
        
    };
    
    let volumeSlider = document.querySelector("#volumeSlider");
    let volmeLabel = document.querySelector("volumeLabel");
    
    //add .oninput event ot sliuder
    volumeSlider.oninput = e =>{
        //set the gain
        audio.setVolume(e.target.value);
        //update value o flabel to match slider value
        volumeLabel.innerHTML  = Math.round((e.target.value/2*100));
    };
    
    volumeSlider.dispatchEvent(new Event("input"));
    
    let trackSelect = document.querySelector("#trackSelect");
    
    trackSelect.onchange = e =>{
        
        audio.loadSoundFile(e.target.value);
        
        if(playButton.dataset.playing = "yes"){
            
            playButton.dispatchEvent(new MouseEvent("click"));
            
        }
        
    };
    
    let barCheck = document.querySelector("#barsCB");
    
    barCheck.onclick = () =>{
        
        console.log(barCheck.checked);
        drawParams.showBars = barCheck.checked;
        
    }
    
    let lineCheck = document.querySelector("#linesCB");
    
    lineCheck.onclick = () =>{
        
        console.log(lineCheck.checked);
        drawParams.showLines = lineCheck.checked;
        
    }
    
    let circleCheck = document.querySelector("#circlesCB");
    
    circleCheck.onclick = () =>{
        
        console.log(circleCheck.checked);
        drawParams.showCircles = circleCheck.checked;
        
    }
    
    let gradientCheck = document.querySelector("#gradientCB");
    
    gradientCheck.onclick = () =>{
        
        console.log(gradientCheck.checked);
        drawParams.showGradient = gradientCheck.checked;
        
    }
    
    let noiseCheck = document.querySelector("#noiseCB");
    
    noiseCheck.onclick = () =>{
        
        console.log(noiseCheck.checked);
        drawParams.showNoise = noiseCheck.checked;
        
    }
    
    let invertCheck = document.querySelector("#invertCB");
    
    invertCheck.onclick = () =>{
        
        console.log(invertCheck.checked);
        drawParams.showInvert = invertCheck.checked;
        
    }
    let embossCheck = document.querySelector("#embossCB");
    
    embossCheck.onclick = () =>{
        
        console.log(embossCheck.checked);
        drawParams.showEmboss = embossCheck.checked;
        
    }
} // end setupUI

export {init};