// EnvParser.js

class EnvParser {
    // -----------------------------------------------------------------------------
    // getRequiredString:
    // Obtiene una variable de entorno obligatoria.
    // Lanza error si no existe o está vacía.
    // -----------------------------------------------------------------------------
    static getRequiredString(name) {
        const value = process.env[name];

        if (typeof value !== 'string' || value.trim() === '') {
            throw new Error(
                `La variable de entorno '${name}' es obligatoria y no puede estar vacía.`
            );
        }

        return value.trim();
    }

    // -----------------------------------------------------------------------------
    // getMongoUri:
    // Obtiene una variable de entorno obligatoria para conexión MongoDB.
    // Valida que inicie con 'mongodb://' o 'mongodb+srv://'.
    // -----------------------------------------------------------------------------
    static getMongoUri(name) {
        const value = this.getRequiredString(name);

        if (
            !value.startsWith('mongodb://') &&
            !value.startsWith('mongodb+srv://')
        ) {
            throw new Error(
                `La variable de entorno '${name}' debe ser una URI válida de MongoDB.`
            );
        }

        return value;
    }

    // -----------------------------------------------------------------------------
    // getPositiveInteger:
    // Obtiene un entero positivo opcional con un valor predeterminado.
    // -----------------------------------------------------------------------------
    static getPositiveInteger(name, defaultValue) {
        const value = process.env[name];

        if (value === undefined || value === null || value.trim() === '') {
            return defaultValue;
        }

        const parsedValue = Number(value);

        if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
            throw new Error(
                `La variable de entorno '${name}' debe ser un entero positivo.`
            );
        }

        return parsedValue;
    }
}

module.exports = EnvParser;
