import {loadFrozenModel, NamedTensorMap} from '@tensorflow/tfjs-converter';
import * as tfc from '@tensorflow/tfjs-core';
import {FACE_CLASSES} from './face_classes';

const MODEL_URL = 'dist/web_model/web_model.pb';
const WEIGHTS_URL = 'dist/web_model/weights.json';
const INPUT_NODE_NAME = 'input';
const OUTPUT_NODE_NAME = 'final_result';
const PREPROCESS_DIVISOR = tfc.scalar(255 / 2);

export class MobileNet {
  constructor() {}

  async load() {
    this.model = await loadFrozenModel(MODEL_URL, WEIGHTS_URL);
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
    }
  }
  /**
   * Infer through MobileNet. This does standard ImageNet pre-processing before
   * inferring through the model. This method returns named activations as well
   * as softmax logits.
   *
   * @param input un-preprocessed input Array.
   * @return The softmax logits.
   */
  predict(input) {
    const preprocessedInput = tfc.div(
        tfc.sub(input.asType('float32'), PREPROCESS_DIVISOR),
        PREPROCESS_DIVISOR);
    const reshapedInput =
        preprocessedInput.reshape([1, ...preprocessedInput.shape]);
    return this.model.execute(
        {[INPUT_NODE_NAME]:reshapedInput}, OUTPUT_NODE_NAME);
  }

  getTopKClasses(predictions, topK) {
    const values = predictions.dataSync();
    predictions.dispose();

    let predictionList = [];
    for (let i = 0; i < values.length; i++) {
      predictionList.push({value: values[i], index: i});
    }
    predictionList = predictionList
                         .sort((a, b) => {
                           return b.value - a.value;
                         })
                         .slice(0, topK);

    return predictionList.map(x => {
      return {label: FACE_CLASSES[x.index], value: x.value};
    });
  }
}