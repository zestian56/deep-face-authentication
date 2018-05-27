
import * as tf from '@tensorflow/tfjs';
import * as gui from './gui';
import { Webcam } from './webcam';
import 'tracking';
import 'tracking/build/data/face'



const webCam = new Webcam(document.getElementById('webCam'));

async function init() {
    await webCam.start();
    track();
}
function track() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);
    tracking.track('#webCam', tracker, { camera: true });

    tracker.on('track', function (event) {
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function (rect) {
            context.strokeStyle = '#a64ceb';
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.font = '11px Roboto';
            context.fillStyle = "black";
            context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
            context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        });
    });
}

window.onload = function () {
    init();
};
