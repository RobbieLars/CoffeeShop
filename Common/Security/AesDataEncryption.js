// AesDataEncryption.js

const crypto = require('node:crypto');
const IDataEncryption = require('./IDataEncryption');

// Esta clase implementa el cifrado de datos utilizando AES-256-GCM,
// que proporciona confidencialidad e integridad de los datos.
// El constructor recibe una clave de cifrado en formato base64, que debe representar 32 bytes (256 bits).

// Constantes para el algoritmo AES-GCM
const ALGORITHM = 'aes-256-gcm';
const PAYLOAD_ALGORITHM = 'A256GCM';
const PAYLOAD_VERSION = 1;
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

class AesDataEncryption extends IDataEncryption {
    // El constructor recibe la clave de cifrado en formato base64,
    // que debe representar 32 bytes (256 bits).
    constructor(base64Key) {
        super();

        if (!base64Key || typeof base64Key !== 'string') {
            throw new Error('La clave de cifrado es obligatoria.');
        }

        this._key = Buffer.from(base64Key, 'base64');

        if (this._key.length !== 32) {
            throw new Error('La clave de cifrado debe representar 32 bytes en base64.');
        }
    }

    // Encriptar el texto plano, generando un IV
    // aleatorio y un auth tag para garantizar la integridad de los datos.
    encryptText(plainText) {
        if (plainText === null || plainText === undefined) {
            return null;
        }

        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, this._key, iv, {
            authTagLength: TAG_LENGTH
        });

        const ciphertext = Buffer.concat([
            cipher.update(String(plainText), 'utf8'),
            cipher.final()
        ]);

        const tag = cipher.getAuthTag();

        return {
            alg: PAYLOAD_ALGORITHM,
            v: PAYLOAD_VERSION,
            iv: iv.toString('base64'),
            tag: tag.toString('base64'),
            ct: ciphertext.toString('base64')
        };
    }

    // Desencriptar el texto cifrado, verificando la integridad de los datos.
    decryptText(encryptedPayload) {
        if (!encryptedPayload) {
            return null;
        }

        this._validatePayload(encryptedPayload);

        const iv = Buffer.from(encryptedPayload.iv, 'base64');
        const tag = Buffer.from(encryptedPayload.tag, 'base64');
        const ct = Buffer.from(encryptedPayload.ct, 'base64');

        const decipher = crypto.createDecipheriv(ALGORITHM, this._key, iv, {
            authTagLength: TAG_LENGTH
        });

        decipher.setAuthTag(tag);

        try {
            const decrypted = Buffer.concat([
                decipher.update(ct),
                decipher.final()
            ]);

            return decrypted.toString('utf8');
        } catch {
            throw new Error('No se pudo descifrar el payload: datos inválidos o alterados.');
        }
    }

    _validatePayload(payload) {
        if (typeof payload !== 'object' || payload === null) {
            throw new Error('El payload cifrado es inválido.');
        }

        if (payload.alg !== PAYLOAD_ALGORITHM) {
            throw new Error('El algoritmo del payload no es válido.');
        }

        if (payload.v !== PAYLOAD_VERSION) {
            throw new Error('La versión del payload no es válida.');
        }

        if (
            typeof payload.iv !== 'string' ||
            typeof payload.tag !== 'string' ||
            typeof payload.ct !== 'string'
        ) {
            throw new Error('El payload cifrado es inválido.');
        }

        const iv = Buffer.from(payload.iv, 'base64');
        const tag = Buffer.from(payload.tag, 'base64');

        if (iv.length !== IV_LENGTH) {
            throw new Error('El IV es inválido.');
        }

        if (tag.length !== TAG_LENGTH) {
            throw new Error('El auth tag es inválido.');
        }
    }
}

module.exports = AesDataEncryption;
