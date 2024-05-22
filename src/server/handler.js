const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
	// mengambil data gambar dari payload
	const { image } = request.payload;
	// model dari "server.app" yang didefinisikan di "server.js".
	const { model } = request.server.app;

	// menjalankan fungsi predictClassification yang sebelumnya telah dibuat di "inferenceService.js".
	// menggunakan image dan model sebagai parameternya.
	const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
	// menggunakan library bawaan crypto untuk membuat nomor unik yang akan digunakan dalam pembuatan variabel id
	const id = crypto.randomUUID();
	// variabel createdAt sebagai timestamp untuk menandakan waktu terjadinya prediksi.
	const createdAt = new Date().toISOString();

	// menyimpan seluruh data pada objek bernama ‘data’.
	const data = {
		id: id,
		result: label,
		explanation: explanation,
		suggestion: suggestion,
		confidenceScore: confidenceScore,
		createdAt: createdAt,
	};

    await storeData(id, data);

	const response = h.response({
		status: "success",
		message: confidenceScore > 99 ? "Model is predicted successfully." : "Model is predicted successfully but under threshold. Please use the correct picture",
		data,
	});
	response.code(201);
	return response;
}

module.exports = postPredictHandler;
