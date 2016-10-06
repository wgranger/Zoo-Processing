
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
const textureBricks = require('../images/texture-bricks.jpg');

export default class Example3D extends React.Component {
  render() {
    
    return (
      <div>
        <Script src={processingSrc}>{
          ({done}) => !done ? null : this.initProcessing()
        }</Script>
        <h2>Example 3D</h2>
        <canvas ref="myCanvas" width="800" height="600"></canvas>
      </div>
    );
  }
  
  initProcessing() {
    if (!window.Processing) return;  //Processing is initialised by the react-loadscript.

    //3D setup
    //--------------------------------
    this.pSketch = new window.Processing.Sketch();
    this.pSketch.use3DContext = true;
    this.pSketch.imageCache.add(textureBricks);  //Preload image
    this.pSketch.attachFunction = this.sketch.bind(this);
    this.p = new Processing(this.refs.myCanvas, this.pSketch);
    //--------------------------------
    
    return null;  //We have to return a "React component" or null.
  }
  
  sketch(processing) {
    //Example 3D block from http://processingjs.org/learning/
    //Put your own code here!
    //--------------------------------
    var tex;
    var rotx = Math.PI/4;
    var roty = Math.PI/4;

    //Setup
    processing.setup = function() {
      processing.size(640, 360, processing.P3D);
      tex = processing.loadImage(textureBricks);
      processing.textureMode(processing.NORMALIZED);
      processing.fill(255);
      processing.stroke(processing.color(44,48,32));
    };

    //Draw cycle
    processing.draw = function() {
      processing.background(0);
      processing.noStroke();
      processing.translate(processing.width/2.0, 
                           processing.height/2.0, -100);
      processing.rotateX(rotx);
      processing.rotateY(roty);
      processing.scale(90);
      texturedCube(tex);
    };

    //"Create Cube" function
    function texturedCube(tex) {
      processing.beginShape(processing.QUADS);
      processing.texture(tex);

      // +Z "front" face
      processing.vertex(-1, -1,  1, 0, 0);
      processing.vertex( 1, -1,  1, 1, 0);
      processing.vertex( 1,  1,  1, 1, 1);
      processing.vertex(-1,  1,  1, 0, 1);

      // -Z "back" face
      processing.vertex( 1, -1, -1, 0, 0);
      processing.vertex(-1, -1, -1, 1, 0);
      processing.vertex(-1,  1, -1, 1, 1);
      processing.vertex( 1,  1, -1, 0, 1);

      // +Y "bottom" face
      processing.vertex(-1,  1,  1, 0, 0);
      processing.vertex( 1,  1,  1, 1, 0);
      processing.vertex( 1,  1, -1, 1, 1);
      processing.vertex(-1,  1, -1, 0, 1);

      // -Y "top" face
      processing.vertex(-1, -1, -1, 0, 0);
      processing.vertex( 1, -1, -1, 1, 0);
      processing.vertex( 1, -1,  1, 1, 1);
      processing.vertex(-1, -1,  1, 0, 1);

      // +X "right" face
      processing.vertex( 1, -1,  1, 0, 0);
      processing.vertex( 1, -1, -1, 1, 0);
      processing.vertex( 1,  1, -1, 1, 1);
      processing.vertex( 1,  1,  1, 0, 1);

      // -X "left" face
      processing.vertex(-1, -1, -1, 0, 0);
      processing.vertex(-1, -1,  1, 1, 0);
      processing.vertex(-1,  1,  1, 1, 1);
      processing.vertex(-1,  1, -1, 0, 1);

      processing.endShape();
    }

    //User Input
    processing.mouseDragged = function() {
      var rate = 0.01;
      rotx += (processing.pmouseY-processing.mouseY) * rate;
      roty += (processing.mouseX-processing.pmouseX) * rate;
    };
  }
  //--------------------------------
}
