/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData,degree=180;

let barGradient,sunRiseGRAD,oceanGRAD,sunGRAD;

function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,
                                       [{percent:0,color:"black"},
                                        {percent:.5,color:"grey"},
                                        {percent:1,color:"white"}]);
    
    barGradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight/2,
                                       [{percent:0,color:"pink"},
                                        {percent:.5,color:"grey"},
                                        {percent:1,color:"orange"}]);
    
    sunRiseGRAD = utils.getLinearGradient(ctx,0,0,0,canvasHeight/2,
                                       [{percent:0,color:"purple"},
                                        {percent:.5,color:"red"},
                                        {percent:1,color:"orange"}]);
    
    oceanGRAD = utils.getLinearGradient(ctx,0,0,0,canvasHeight/2,
                                       [{percent:0,color:"#4B0082"},
                                        {percent:.25,color:"#191970"},
                                        {percent:1,color:"#000080"}]); 
    //barGradient
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);
}

function draw(params={}){
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	//analyserNode.getByteFrequencyData(audioData);
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	// 2 - draw background
	ctx.save();
    ctx.fillStyle = sunRiseGRAD;
    ctx.globalAlpha = .1;
    ctx.fillRect(0,0,canvasWidth,canvasHeight/2);
    ctx.restore();

    //draw bars before drawing the ocean or sun, for proper layering
    
    if(params.showBars){
        
        analyserNode.getByteFrequencyData(audioData);
        
        let heightMod = .25;
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 200;
        let topSpacing = 100;
        
        ctx.save();
        ctx.fillStyle = barGradient;//'rgba(0,255,0,0.50)';
        ctx.strokeStyle = '#4169E1';
        //loop through the data and draw
        //for(let j = 0; j < 4;j++){
            
            //ctx.beginPath();
            
            //let heightStep = (canvasHeight/2)*(1/5)
            
            //let finalHeight = (canvasHeight/2)+(heightStep*(j+1));
            
            //ctx.moveTo(0,finalHeight);
            
            for(let i = 0; i < audioData.length; i++){
            
                ctx.save();
            
                let heightAdj = audioData[i]*heightMod;
                
                //ctx.lineTo(margin + i * (barWidth + barSpacing), finalHeight + (heightAdj));
            
                ctx.translate(margin + i * (barWidth + barSpacing), canvasHeight/2);
            
                //ctx.fillRect(0,0,barWidth,heightAdj);

                ctx.rotate(degree*(Math.PI/180));
            
                ctx.fillRect(-barWidth,0,barWidth,heightAdj);
            
                    /*
                    ctx.save();
            
                //ctx.translate(margin + i * (barWidth - (barWidth/2) + barSpacing), canvasHeight/2);
                    ctx.rotate(degree*(Math.Pi/180));
                //ctx.translate(0, 0);
                //ctx.translate(margin + i * (barWidth + barSpacing), canvasHeight/2);
            
            
            
                    ctx.restore();*/
                    //ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i],barWidth,barHeight);
                ctx.restore();
            
            //}
            
            //ctx.closePath();
            //ctx.lineTo(canvasWidth, finalHeight);
            
            //ctx.stroke();
            
        }

        ctx.restore();
        
    }
    
    ctx.save();
    
    ctx.fillStyle = "yellow";
    
    ctx.beginPath();
    ctx.arc(canvasWidth/2,canvasHeight/2,75,0,Math.PI*2);
    //ctx.closePath();
    
    ctx.fill();
    
    ctx.restore();
    
    ctx.save();
    
    ctx.fillStyle = oceanGRAD;
    
    ctx.fillRect(0,canvasHeight/2,canvasWidth,canvasHeight);
    
    ctx.restore();
    
    //draw ocean "waves" after a background
    
	// 3 - draw gradient
	if(params.showGradient){
        
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .3;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
        
    }
	// 4 - draw lines
	if(params.showLines){
        
        analyserNode.getByteTimeDomainData(audioData); // waveform data
        
        let heightMod = .05;
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 200;
        let topSpacing = 100;
        
        ctx.save();
        ctx.fillStyle = barGradient;//'rgba(0,255,0,0.50)';
        ctx.strokeStyle = '#4169E1';
        //loop through the data and draw
        for(let j = 0; j < 4;j++){
            
            ctx.beginPath();
            
            let heightStep = (canvasHeight/2)*(1/5)
            
            let finalHeight = (canvasHeight/2)+(heightStep*(j+1));
            
            ctx.moveTo(0,finalHeight);
            
            for(let i = 0; i < audioData.length; i++){
            
                ctx.save();
            
                let heightAdj = audioData[i]*heightMod;
                
                ctx.lineTo(margin + i * (barWidth + barSpacing), finalHeight + (heightAdj));
            
                //ctx.translate(margin + i * (barWidth + barSpacing), canvasHeight/2);
            
                //ctx.fillRect(0,0,barWidth,heightAdj);

                //ctx.rotate(degree*(Math.PI/180));
            
                //ctx.fillRect(-barWidth,0,barWidth,heightAdj);
            
                    /*
                    ctx.save();
            
                //ctx.translate(margin + i * (barWidth - (barWidth/2) + barSpacing), canvasHeight/2);
                    ctx.rotate(degree*(Math.Pi/180));
                //ctx.translate(0, 0);
                //ctx.translate(margin + i * (barWidth + barSpacing), canvasHeight/2);
            
            
            
                    ctx.restore();*/
                    //ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i],barWidth,barHeight);
                ctx.restore();
            
            }
            
            //ctx.closePath();
            ctx.lineTo(canvasWidth, finalHeight);
            
            ctx.stroke();
            
        }

        ctx.restore();
        
    }

	// 5 - draw circles
    if(params.showCircles){
    
        let maxRadius = canvasHeight/4;
        ctx.save();
        ctx.globalAlpha = 0.5;
        for(let i=0; i<audioData.length; i++){
        
            let percent = audioData[i]/255;
        
            let circleRadius = percent * maxRadius;
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(255,111,111,.34-percent/3.0);
            ctx.arc(canvasWidth/2,canvasHeight/2,circleRadius, 0, 2*Math.PI, false);
            ctx.fill();
            ctx.closePath();
        
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0,0,255,.10-percent/10.0);
            ctx.arc(canvasWidth/2,canvasHeight/2,circleRadius*1.5, 0, 2*Math.PI, false);
            ctx.fill();
            ctx.closePath();
        
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(200,200,0,.5-percent/5.0);
            ctx.arc(canvasWidth/2,canvasHeight/2,circleRadius*.50, 0, 2*Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        
        }
        
        ctx.restore();
        
        // 6 - bitmap manipulation
	   // TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	   // regardless of whether or not we are applying a pixel effect
	   // At some point, refactor this code so that we are looping though the image data only if
	   // it is necessary
        //ctx.save();
	   // A) grab all of the pixels on the canvas and put them in the `data` array
	   // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	   // the variable `data` below is a reference to that array 
	   let imageData = ctx.getImageData(0,0,canvasWidth, canvasHeight);
        let data = imageData.data;
        let length = data.length;
        let width = imageData.width;
	   // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
        for (let i = 0; i < length; i+=4){
		  // C) randomly change every 20th pixel to red
	       if(params.showNoise && Math.random() < .05){
			     // data[i] is the red channel
			     // data[i+1] is the green channel
			     // data[i+2] is the blue channel
                // data[i+3] is the alpha channel
                data[i] = data[i+1] = data[i+2]=0;// zero out the red and green and blue channels
			     data[i] = 178;// make the red channel 100% red
                data[i+2] = 129;
		  } // end if
            if(params.showInvert){
                
                let red = data[i], green = data[i+1], blue = data[i+2];
                data[i] = 255-red;
                data[i + 1] = 255 - green;
                data[i + 2] = 255 - blue;
                //datap[i+3] isn alpha. but unused
                
            }

	   } // end for
	   if(params.showEmboss){
                
                for(let i = 0; i<length;i++){
                    
                    if(i%4==3)continue; //skip alpha
                    data[i]=127+2*data[i]-data[i+4]-data[i+width*4];
                    
                }
                
        }
        //ctx.restore();
	// D) copy image data back to canvas
    ctx.putImageData(imageData,0,0);
    }
}

export {setupCanvas,draw};