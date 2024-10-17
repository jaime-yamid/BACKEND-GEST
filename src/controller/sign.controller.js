import { generateKeyPairSync } from "crypto";
//geerar certificado
import { generarCertificado } from "../helpers/generateCertificate.js";
import forge from 'node-forge';
import fs from 'fs';
//MULTER
import multer from 'multer'
// Configura multer para guardar los archivos en un directorio específico
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Aquí especifica el directorio donde quieres guardar los archivos
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // Aquí puedes cambiar el nombre del archivo si lo deseas
    }
  });
  
  // Crea el middleware multer con la configuración especificada
  const upload = multer({ storage: storage });
const signcontroller = {}
//Logica para el login
signcontroller.sign = async (req,res) => {
    console.log(req['files'])
    console.log(req.files)
    const file = req.files.file;
    const documento = req.files.file;

    // Aquí suponemos que tienes la clave privada almacenada en un archivo llamado private.key
    const privateKeyPem = fs.readFileSync('private.key', 'utf8');
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

    // Crear la firma digital del documento
    const md = forge.md.sha256.create();
    md.update(documento, 'utf8');
    const firma = privateKey.sign(md);

    // Aquí puedes hacer más procesamiento si es necesario, como incluir información adicional en la firma

    // Construye el objeto de respuesta con la firma y cualquier otra información relevante
    const respuesta = {
        firma: forge.util.encode64(firma),
        // Otras propiedades según sea necesario
    };

    // Retorna la respuesta al frontend
    res.json(respuesta);


  // Guarda el archivo en el servidor
//   file.mv(`./${file.name}`, (err) => {
//         if (err) {
//         return res.status(500).send(err);
//         }
//     })
    
    // generateKey()
    
}
signcontroller.certificado = async (req,res) => {
    // console.log(req['files'])
    // console.log(req.files)
    // const file = req.files.file;
    // const documento = req.files.file;

    
    generateKey()
    
}
//Generar clave
function generateKey() {
    
// Crear una clave privada
const keys = forge.pki.rsa.generateKeyPair({ bits: 2048 });
const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);

// Crear un certificado autofirmado
const cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

const attrs = [
    { name: 'commonName', value: 'example.com' },
    { name: 'countryName', value: 'US' },
    { shortName: 'ST', value: 'New York' },
    { name: 'localityName', value: 'New York' },
    { name: 'organizationName', value: 'Example, Inc.' },
    { shortName: 'OU', value: 'Certificate' }
];

cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.sign(keys.privateKey);

// Convertir el certificado y la clave privada a formato PEM
const certPem = forge.pki.certificateToPem(cert);

// Guardar el certificado y la clave privada en archivos
fs.writeFileSync('certificate.crt', certPem);
fs.writeFileSync('private.key', privateKeyPem);

console.log('Certificado autofirmado y clave privada generados con éxito.');

}
// Función para firmar un documento y adjuntar la firma
function firmarDocumento(documento, privateKeyPem, callback) {
    firmarDocumento(documentoOriginal, privateKeyPem, (err, documentoFirmado) => {
        if (err) {
          console.error('Error al firmar el documento:', err);
          return;
        }
      
        console.log('Documento firmado:', documentoFirmado);
      });
    // Convertir la clave privada a formato Forge
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  
    // Crear la firma digital del documento
    const md = forge.md.sha256.create();
    md.update(documento, 'utf8');
    const firma = privateKey.sign(md);
  
    // Adjuntar la firma al documento
    const documentoFirmado = `${documento}\nFirma Digital: ${forge.util.encode64(firma)}`;
  
    // Guardar el documento firmado en un nuevo archivo
    fs.writeFileSync('documento_firmado.txt', documentoFirmado);
  
    // Llamar al callback con el documento firmado
    callback(null, documentoFirmado);
  }
  

    


export {signcontroller}