import * as tfc from '@tensorflow/tfjs-core';
import { Webcam } from './webcam';
import { loadFrozenModel } from '@tensorflow/tfjs-converter';
import { MobileNet } from './mobilenet';

let isPredicting = false;
const mobileNet = new MobileNet();

const webCam = new Webcam(document.getElementById('webCam'));

async function init() {
    await webCam.start();
    await webCam.track();
    console.time('Loading of model');
    await mobileNet.load();
    console.timeEnd('Loading of model');
}


async function predict() {
    const cat = document.getElementById('test');
    const pixels = tfc.fromPixels(cat);

    const resultElement = document.getElementById('result');
    console.time('First prediction');
    let result = mobileNet.predict(pixels);
    const topK = mobileNet.getTopKClasses(result, 5);
    console.timeEnd('First prediction');
    resultElement.innerText = '';
    topK.forEach(x => {
        resultElement.innerText += `${x.value.toFixed(3)}: ${x.label}\n`;
    });

    console.time('Subsequent predictions');
    result = mobileNet.predict(pixels);
    mobileNet.getTopKClasses(result, 5);
    console.timeEnd('Subsequent predictions');
}





document.getElementById('test').addEventListener('click', () => {
    isPredicting = true;
    predict();
});
window.onload = function () {
    init();
};


