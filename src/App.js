import React,{useRef} from 'react';
import * as tf from "@tensorflow/tfjs"
import * as bodyPix from '@tensorflow-models/body-pix'
import Webcam from 'react-webcam'
import './App.css';

function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const bodySegmentation = async()=>{
    const net = await bodyPix.load()
    console.log('Model loading successful')
    setInterval(()=>{
      detect(net)},100)
  }
  
  const detect = async(net)=>{
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const person = await net.segmentPersonParts(video);
      
      console.log(person);
      const coloredPartImage = bodyPix.toColoredPartMask(person);
      const opacity = 0.7;
      const flipHorizontal = false;
      const maskBlurAmount = 0;
      const canvas = canvasRef.current;
      bodyPix.drawMask(
        canvas,
        video,
        coloredPartImage,
        opacity,
        maskBlurAmount,
        flipHorizontal,
        
        
      );
    }
  }

  bodySegmentation();
  return (
    <div className="App">
      <header className="App-header">
      <h1>Body Segmentation</h1>
      <Webcam ref={webcamRef}
      style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }} />
      <canvas ref={canvasRef}
      style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }} />
           </header>
    </div>
  )
}

export default App;
