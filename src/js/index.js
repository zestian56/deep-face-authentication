import * as tfc from '@tensorflow/tfjs-core';
import { Webcam } from './webcam';
import { loadFrozenModel } from '@tensorflow/tfjs-converter';
import { MobileNet } from './mobilenet';

let isPredicting = false;
const mobileNet = new MobileNet();

const webCam = new Webcam(document.getElementById('webCam'));
var face;


async function init() {
    console.time('Loading of model');
    await mobileNet.load();
    console.timeEnd('Loading of model');

    await webCam.start();
    await track();


}


async function predict(image) {
    var image2 = document.getElementById('test')
    const pixels = tfc.fromPixels(image);
    const resultElement = document.getElementById('result');
    //console.time('Prediction');
    let result = mobileNet.predict(pixels);
    const topK = mobileNet.getTopKClasses(result, 5);
    //console.timeEnd('Prediction');
    resultElement.innerText = '';
    topK.forEach(x => {
        resultElement.innerText += `${x.value.toFixed(3)}: ${x.label}\n`;
    });
}

async function track() {
    return new Promise((resolve, reject) => {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');


        var tracker = new tracking.ObjectTracker('face');
        tracker.setInitialScale(4);
        tracker.setStepSize(2);
        tracker.setEdgesDensity(0.1);

        tracking.track('#webCam', tracker);
        var imageData = 'nada';
        
        tracker.on('track', function (event) {

            var webcam = document.getElementById('webCam');
            console.log(webcam.width,webcam.height)
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(webcam, 0, 0, webcam.width, webcam.height);
            event.data.forEach(rect => {

                context.strokeStyle = '#a64ceb';
                context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                context.font = '11px Roboto';
                context.fillStyle = "black";
                context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);

                imageData = context.getImageData(rect.x, rect.y, rect.width, rect.height);
                context.putImageData(imageData,0,0)
                predict(imageData)
                console.log(imageData)

            });
        });
        resolve();
    })
}





window.onload = function () {
    init();
};


