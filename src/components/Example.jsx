
/*
To use Processing.JS in our React projects, we need to do the following:

1. We import the compile FILE (not the library) processing.js from node_modules
  via import processingSrc from 'file!processing-js/processing.js';

2. The JS file needs to be loaded into our React app using react-loadscript.

  <Script src={js_file_source_path}>{
     ({done}) => !done ? doSomethingWhileLoading() : doSomethingWhenLoaded()
  }</Script>
  
  //Note that doSomethingWhileLoading() and doSomethingWhenLoaded() needs to
  //return either null or a React component or, e.g. <div>Loading...</div>

3. Once Processing has loaded (it'll be loaded into the global namespace), we
   can initialise it by calling
   var p = new Processing(reference_to_canvas, your_processing_code);
********************************************************************************
 */

import React from 'react';
import processingSrc from 'file!processing-js/processing.js';
import { Script } from 'react-loadscript';

export default class Example extends React.Component {
  render() {
    
    return (
      <div>
        <Script src={processingSrc}>{
          ({done}) => !done ? null : this.initProcessing()
        }</Script>
        <h2>Example</h2>
        <canvas ref="myCanvas" width="800" height="600"></canvas>
      </div>
    );
  }
  
  initProcessing() {
    if (!Processing) return;  //Processing is initialised by the react-loadscript.
    var p = new Processing(this.refs.myCanvas, this.sketch);
    return null;  //We have to return a "React component" or null.
  }
  
  sketch(processing) {
    //Example clock code from http://processingjs.org/learning/
    //Put your own code here!
    //--------------------------------
    processing.draw = function() {
      var centerX = processing.width / 2, centerY = processing.height / 2;
      var maxArmLength = Math.min(centerX, centerY);
      function drawArm(position, lengthScale, weight) {      
        processing.strokeWeight(weight);
        processing.line(centerX, centerY, 
          centerX + Math.sin(position * 2 * Math.PI) * lengthScale * maxArmLength,
          centerY - Math.cos(position * 2 * Math.PI) * lengthScale * maxArmLength);
      }
      processing.background(224);
      var now = new Date();
      var hoursPosition = (now.getHours() % 12 + now.getMinutes() / 60) / 12;
      drawArm(hoursPosition, 0.5, 5);
      var minutesPosition = (now.getMinutes() + now.getSeconds() / 60) / 60;
      drawArm(minutesPosition, 0.80, 3);
      var secondsPosition = now.getSeconds() / 60;
      drawArm(secondsPosition, 0.90, 1);
    };
    //--------------------------------
  }
}
