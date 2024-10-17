import pem from 'pem';
import fs from 'fs';

// Función para generar el certificado autofirmado
export function generarCertificado(callback) {
  pem.createCertificate({ days: 365, selfSigned: true }, function(err, keys) {
    if (err) {
      callback(err, null);
      return;
    }

    // Guarda la clave privada
    fs.writeFileSync('private.key', keys.serviceKey);

    // Guarda el certificado
    fs.writeFileSync('certificate.crt', keys.certificate);

    callback(null, keys);
  });
}
