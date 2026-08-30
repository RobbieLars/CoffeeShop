// IDataEncryption.js

// Interfaz para servicios de cifrado de datos. Define los métodos para cifrar y descifrar texto.

class IDataEncryption {
    constructor() {
        if (new.target === IDataEncryption) {
            throw new Error('IDataEncryption no puede ser instanciada directamente.');
        }
    }

    // -----------------------------------------------------------------------------
    // encryptText:
    // Cifra un texto plano y devuelve el texto cifrado.
    // -----------------------------------------------------------------------------
    encryptText(plainText) {
        throw new Error('Method "encryptText" not implemented.');
    }

    // -----------------------------------------------------------------------------
    // decryptText:
    // Descifra un texto cifrado y devuelve el texto plano original.
    // -----------------------------------------------------------------------------
    decryptText(encryptedPayload) {
        throw new Error('Method "decryptText" not implemented.');
    }
}

module.exports = IDataEncryption;
