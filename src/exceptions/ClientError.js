// ClientError.js akan berisikan class untuk menangani error dari sisi klien secara umum.

// membuat class ClientError sebagai turunan dari class Error dalam JavaScript.
class ClientError extends Error {
    // Pada bagian constructor, kita mendefinisikan dua parameter, yakni message dan statusCode.
    // statusCode diisi dengan nilai default 400 yang menandakan adanya client error.
	constructor(message, statusCode = 400) {
        // menggunakan sintaks "super()" untuk mengambil properti dari class Error.
		super(message);
        // Setelah diambil, kita mengubah statusCode dan nama ClientError untuk membuat error lebih spesifik.
		this.statusCode = statusCode;
		this.name = "ClientError";
	}
}

module.exports = ClientError;
