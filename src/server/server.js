// menambahkan kode dibawah untuk mengambil environment variable.
// Pada kode ini, library dotenv akan melacak variabel pada file .env dan menyimpannya pada server.
require('dotenv').config();

const Hapi = require("@hapi/hapi");
const routes = require('../server/routes');
// impor fungsi loadModel yang sebelumnya sudah dibuat di file "loadModel.js"
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

(async () => {
	const server = Hapi.server({
		port: 3000,
		host: process.env.NODE_ENV !== 'production' ? 'localhost': '0.0.0.0',
		routes: {
			cors: {
				origin: ["*"],
			},
		},
	});

    // menjalankan fungsi "loadModel()" dengan mengambil data menggunakan "await" dan menyimpannya pada variabel "model"
    const model = await loadModel();
    // menggunakan "server.app" untuk menyimpan hasil load model ke aplikasi.
    // hal ini bertujuan untuk tidak terus menerus melakukan load model pada setiap request pengguna yang masuk,
    // hal itu akan menambah banyak beban, seperti latensi yang tinggi, respons web service yang lama, hingga harga layanan Cloud Storage yang meningkat. 
    // server.app adalah properti server pada Hapi yang menyediakan tempat aman untuk menyimpan data.
    server.app.model = model;

	server.route(routes);

	// server.ext() adalah fungsi yang bertugas untuk menangani extension dalam Hapi.
	// Pada kode di bawah, extension yang digunakan adalah onPreResponse. server.ext() disimpan setelah "server.route()".
	// Ini artinya, server akan menjalankan seluruh konfigurasi routes terlebih dahulu.
	// Setelah routes, extension akan memeriksa response yang dihasilkan.
	// Jika terjadi kesalahan, extension ini akan menerima informasi tersebut.

	// "server.ext()" menerima dua parameter yang wajib dipenuhi, yaitu event dan method.
	// Pada kode di bawah, parameter event yang diberikan adalah "onPreResponse".
	// Parameter kedua adalah method, yaitu fungsi yang menangani permintaan server dengan menerima dua parameter, yakni request dan h.
	// Di sini peran penting dimulai, kita menyimpan segala response dari setiap permintaan (request) pengguna ke variabel response.
	server.ext("onPreResponse", function (request, h) {
		const response = request.response;

		// InputError akan berasal dari file "InputError.js"
		// Pada kode extension onPreResponse, kita menangani error dengan dua cara.
		// Pertama adalah jika response-nya adalah Input Error atau terjadi kesalahan input seperti dibawah ini.
		if (response instanceof InputError) {
			const newResponse = h.response({
				status: "fail",
				message: `${response.message} Silakan gunakan foto lain.`,
			});
			
            newResponse.code(response.statusCode);
			return newResponse;
		}

		// salah satu method dari event "onPreResponse" adalah ".isBoom",
		// Method ini akan menghasilkan boolean true jika terjadi error pada response dan akan menghasilkan false jika tidak terjadi.
		// Penanganan kedua adalah jika terjadi kesalahan atau error server.
		// Kesalahan ini dibangkitkan dengan menggunakan method ".isBoom" yang artinya jika benar terjadi kesalahan akan bernilai true.
		if (response.isBoom) {
			const newResponse = h.response({
				status: "fail",
				message: response.message,
			});

			newResponse.code(response.statusCode);
			return newResponse;
		}

        // sintaks dibawah untuk melanjutkan proses server tanpa mengubah response apa pun jika tidak terjadi error.
		return h.continue;
	});

	await server.start();
	console.log(`Server start at: ${server.info.uri}`);
})();
