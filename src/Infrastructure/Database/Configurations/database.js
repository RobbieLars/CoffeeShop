// database.js

// No tocar este archivo a menos que sea para agregar nuevas funciones relacionadas con la base de datos.
// Este módulo se encarga exclusivamente de establecer la conexión a MongoDB utilizando Mongoose.
// La URI de conexión se obtiene de la variable de entorno DB_URI, que es obligatoria.
const mongoose = require('mongoose');
const EnvParser = require('../../Common/Configuration/EnvParser');

const connectDB = async () => {
    // -----------------------------------------------------------------------------
    // Obtener URI de conexión:
    // Lee y valida la variable de entorno obligatoria para MongoDB.
    // -----------------------------------------------------------------------------
    const dbUri = EnvParser.getMongoUri('DB_URI');
    const connection = await mongoose.connect(dbUri);

    console.log(
        `Base de datos CoffeeShop conectada en: ${connection.connection.host}`
    );

    return connection;
};

module.exports = connectDB;
