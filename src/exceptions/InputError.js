// InputError.js akan berisi class berupa turunan dari Client Error. 
// Mengapa harus turunan? Sebab menangani error akan lebih baik jika makin spesifik.

const ClientError = require("../exceptions/ClientError");

// mendefinisikan error baru dengan nama ‘InputError” untuk menangani segala kesalahan karena error input data.

class InputError extends ClientError {
    constructor(message) {
        super(message);
        this.name = 'InputError';
    }
}
 
module.exports = InputError;