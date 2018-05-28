import 'tracking';
import 'tracking/build/data/face'
import * as tf from '@tensorflow/tfjs';

export class Webcam {

    constructor(webcamElement) {
        this.webcamElement = webcamElement;
    }
    async start() {
        return new Promise((resolve, reject) => {
            if (navigator.mediaDevices && navigator.getUserMedia) {
                navigator.getUserMedia({ video: true }, stream => {
                    this.webcamElement.srcObject = stream;

                    resolve();
                }, error => console.log("no hay webcam"))
            }
            else {
                reject();
            }
        })
    }
    capture() {
        return tf.tidy(() => {
            const webcamImage = tf.fromPixels(this.webcamElement);
            const croppedImage = this.cropImage(webcamImage);
            const batchedImage = croppedImage.expandDims(0);
            return batchedImage.toFloat().div(oneTwentySeven).sub(one);
        });
    }
    cropImage(img) {
        const size = Math.min(img.shape[0], img.shape[1]);
        const centerHeight = img.shape[0] / 2;
        const beginHeight = centerHeight - size / 2;
        const centerWidth = img.shape[1] / 2;
        const beginWidth = centerWidth - size / 2;
        return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);
      }
    async track() {
        return new Promise((resolve, reject) => {
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            var tracker = new tracking.ObjectTracker('face');
            tracker.setInitialScale(4);
            tracker.setStepSize(2);
            tracker.setEdgesDensity(0.1);
            tracking.track('#webCam', tracker);

            tracker.on('track', function (event) {

                context.clearRect(0, 0, canvas.width, canvas.height);
                event.data.forEach(rect => {
                    context.strokeStyle = '#a64ceb';
                    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                    context.font = '11px Roboto';
                    context.fillStyle = "black";
                    context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                    context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
                });
            });
            resolve();
        })
    }


}