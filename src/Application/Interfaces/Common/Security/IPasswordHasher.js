// IPasswordHasher.js

// Interfaz para servicios de hashing de contraseñas.
// Define los métodos para generar un hash y verificarlo.

class IPasswordHasher {
  // -----------------------------------------------------------------------------
  // Hash:
  // Genera un hash seguro para una contraseña dada.
  // -----------------------------------------------------------------------------
  async hash(password) {
    throw new Error('Method "hash" not implemented.');
  }

  // -----------------------------------------------------------------------------
  // Verify:
  // Verifica si una contraseña coincide con un hash dado.
  // -----------------------------------------------------------------------------
  async verify(password, hashedPassword) {
    throw new Error('Method "verify" not implemented.');
  }
}

module.exports = IPasswordHasher;