const { Firestore } = require("@google-cloud/firestore");

// fungsi untuk menangani tugas penyimpanan data
// membuat fungsi asynchronous bernama storeData yang menerima dua parameter, yakni id dan data (response API).
async function storeData(id, data) {
	const db = new Firestore();

    // mendefinisikan collection bernama ‘prediction’ 
	const predictCollection = db.collection("prediction");
    // mengembalikan nilai berupa push ‘data’ ke document berdasarkan variabel ‘id’.
	return predictCollection.doc(id).set(data);
}

module.exports = storeData;
