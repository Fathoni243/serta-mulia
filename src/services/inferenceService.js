const tf = require("@tensorflow/tfjs-node");

// Parameter pertama adalah model yang akan digunakan.
// Kedua adalah image sebagai input data baru dari pengguna ketika mengirimkan request ke server.
async function predictClassification(model, image) {
    // membungkus kode dalam fungsi "predictClassification()" ke try-catch. Jika terjadi error, kita akan memanggil "InputError".
	try {
		// kode untuk mengonversi data gambar (image) menjadi tensor.
		// ".node" untuk menangani proses inferensi data.
		const tensor = tf.node
			// .decodeJpeg() untuk melakukan decode terhadap input data baru.
			.decodeJpeg(image)
			// .resizeNearestNeighbor untuk melakukan resize gambar menggunakan algoritma Nearest Neighbor.
			.resizeNearestNeighbor([224, 224])
			// .expandDims() untuk menambah dimensi gambar.
			.expandDims()
			// .toFloat() untuk mengubah seluruh data yang diproses menjadi float.
			.toFloat();

		// Setelah mendapatkan tensor, kita akan menggunakannya untuk mendapatkan prediksi, score, dan confidenceScore.
		// variabel prediction akan menampung hasil prediksi berdasarkan data baru berupa tensor (gambar yang sudah diproses sebelumnya)
		const prediction = model.predict(tensor);
		// mendapatkan seluruh skor yang didapatkan dengan menggunakan perintah "prediction.data();"
		// Maksudnya seperti ini, dengan menjalankan perintah prediction.data() akan menghasilkan score berdasarkan kelas yang ada ('Melanocytic nevus', 'Squamous cell carcinoma', 'Vascular lesion').
		// Skor yang dihasilkan akan bervariasi dan dimulai dari 0 hingga 1.
		// Contohnya, kode tersebut akan menghasilkan [0.2, 0.7, 0.1] yang menandakan bahwa prediksi tersebut menghasilkan skor yang tinggi pada kelas kedua (0.7) atau Squamous cell carcinoma.
		const score = await prediction.data();
		// Sebab skor yang dihasilkan berada pada rentang 0 hingga 1, kita perlu mengalikannya dengan 100 untuk bisa mendapatkan rentang 0 hingga 100.
		const confidenceScore = Math.max(...score) * 100;

		// Pada kode di bawah, kita mendefinisikan variabel classes berisi kelas-kelas atau label-label.
		// Harus diperhatikan bahwa urutan kelas ini tidak boleh tertukar, kita akan mengaksesnya dengan indeks.
		const classes = ["Melanocytic nevus", "Squamous cell carcinoma", "Vascular lesion"];

		// Kita menggunakan tf.argMax(prediction, 1) dalam menghitung indeks dengan nilai maksimum untuk setiap baris dari tensor.
		// Selanjutnya, kita menggunakan metode .dataSync() untuk mengambil data dari tensor, output dari metode ini adalah array yang berurutan dari terbesar hingga terkecil.
		// Jadi, kita menggunakan [0] untuk mengambil elemen pertama dari array tersebut (nilai terbesar).
		// Kita bisa simpulkan, variabel classResult akan berisi nilai indeks dengan rentang 0 hingga 2.
		// Variabel "classResult" selanjutnya digunakan untuk mengakses variabel array classes. Jadi, jika nilai tertinggi adalah indeks ke-0, hasilnya adalah 'Melanocytic nevus' dan begitu pun seterusnya.
		const classResult = tf.argMax(prediction, 1).dataSync()[0];
		const label = classes[classResult];

		let explanation, suggestion;

		// Pada kode di bawah, kita menggunakan percabangan untuk menentukan explanation dan suggestion.
		// Jika nilai label setara dengan ‘Melanocytic nevus’ akan menghasilkan penjelasan dan saran sesuai dengan penyakit tersebut, begitu pun untuk label-label lainnya.
		if (label === "Melanocytic nevus") {
			explanation = "Melanocytic nevus adalah kondisi di mana permukaan kulit memiliki bercak warna yang berasal dari sel-sel melanosit, yakni pembentukan warna kulit dan rambut.";
			suggestion = "Segera konsultasi dengan dokter terdekat jika ukuran semakin membesar dengan cepat, mudah luka atau berdarah.";
		}

		if (label === "Squamous cell carcinoma") {
			explanation = "Squamous cell carcinoma adalah jenis kanker kulit yang umum dijumpai. Penyakit ini sering tumbuh pada bagian-bagian tubuh yang sering terkena sinar UV.";
			suggestion = "Segera konsultasi dengan dokter terdekat untuk meminimalisasi penyebaran kanker.";
		}

		if (label === "Vascular lesion") {
			explanation = "Vascular lesion adalah penyakit yang dikategorikan sebagai kanker atau tumor di mana penyakit ini sering muncul pada bagian kepala dan leher.";
			suggestion = "Segera konsultasi dengan dokter terdekat untuk mengetahui detail terkait tingkat bahaya penyakit.";
		}

		// return data-data yang dibutuhkan
		return { confidenceScore, label, explanation, suggestion };
	} catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`)
    }
}

//  export fungsi "predictClassification()".
module.exports = predictClassification;
