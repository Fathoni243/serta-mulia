const postPredictHandler = require('../server/handler');
 
const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    /* Mengizinkan data berupa gambar dengan options payload */
    // Secara default, gambar yang di-upload harus berukuran maksimal 1MB
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true
      }
    }
  }
]
 
module.exports = routes;