import 'tracking';
import 'tracking/build/data/face'

export class Webcam {

    constructor(webcamElement) {
        this.webcamElement = webcamElement;
    }
    async start() {
        return new Promise((resolve, reject) => {
            if (navigator.mediaDevices && navigator.getUserMedia) {
                navigator.getUserMedia({ video: true }, stream => {
                    console.log("lmao kid")
                    this.webcamElement.srcObject= stream;
                    
                    resolve();
                }, error => console.log("no hay webcam"))
            }
            else{
                reject();
            }
        })
    }

}