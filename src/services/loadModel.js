const tf = require('@tensorflow/tfjs-node');

// load model disimpan dalam fungsi asynchronous bernama loadModel().
async function loadModel() {
    // menggunakan ".loadGraphModel()" untuk melakukan load model.
    // melakukan load model yang mengambil dari environment variable.
    return tf.loadGraphModel(process.env.MODEL_URL);
}

module.exports = loadModel;