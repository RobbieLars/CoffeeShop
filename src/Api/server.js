// server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('../Infrastructure/Database/Configurations/database');
const EnvParser = require('../Infrastructure/Common/Configuration/EnvParser');
const errorHandler = require('@coffeeshop/common/Http/Express/errorHandler');

// Contenedor de dependencias
const buildDependencyContainer = require('../Infrastructure/dependencyContainer');

// Controllers
const RoleController = require('./Controllers/RoleController');
const PersonController = require('./Controllers/PersonController');
const UserController = require('./Controllers/UserController');
const PetController = require('./Controllers/PetController');
const ProductController = require('./Controllers/ProductController');
const CommentController = require('./Controllers/CommentController');
const PurchaseController = require('./Controllers/PurchaseController');

// Routes
const roleRoutes = require('./Routes/RoleRoutes');
const personRoutes = require('./Routes/PersonRoutes');
const userRoutes = require('./Routes/UserRoutes');
const petRoutes = require('./Routes/PetRoutes');
const productRoutes = require('./Routes/ProductRoutes');
const commentRoutes = require('./Routes/CommentRoutes');
const purchaseRoutes = require('./Routes/PurchaseRoutes');

async function server() {
    let httpServer;

    try {
        // Conectar a la base de datos antes de armar las dependencias
        await connectDB();

        // -----------------------------------------------------------------------------
        // Inyeccion de dependencia
        // -----------------------------------------------------------------------------
        const container = buildDependencyContainer();
        const roleController = new RoleController(container.services.roleService);
        const personController = new PersonController(container.services.personService);
        const userController = new UserController(container.services.userService);
        const petController = new PetController(container.services.petService);
        const productController = new ProductController(container.services.productService);
        const commentController = new CommentController(container.services.commentService);
        const purchaseController = new PurchaseController(
            container.services.purchaseService
        );

        // -----------------------------------------------------------------------------
        // Configuracion del servidor Express
        // -----------------------------------------------------------------------------
        const app = express();
        app.locals.container = container;

        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        // Información básica del servicio.
        app.get('/', (req, res) => {
            res.status(200).json({
                service: 'CoffeeShop API',
                status: 'running'
            });
        });

        // Endpoint para comprobaciones de salud locales y AppHost.
        app.get('/api/health', (req, res) => {
            const databaseConnected = mongoose.connection.readyState === 1;

            return res.status(databaseConnected ? 200 : 503).json({
                service: 'CoffeeShop API',
                status: databaseConnected ? 'healthy' : 'unhealthy',
                database: databaseConnected ? 'connected' : 'disconnected'
            });
        });

        app.use('/api/role', roleRoutes(roleController));
        app.use('/api/person', personRoutes(personController));
        app.use('/api/user', userRoutes(userController));
        app.use('/api/pet', petRoutes(petController));
        app.use('/api/product', productRoutes(productController));
        app.use('/api/comment', commentRoutes(commentController));
        app.use('/api/purchase', purchaseRoutes(purchaseController));

        app.use((req, res) => {
            return res.status(404).json({
                message: 'Recurso no encontrado.'
            });
        });

        app.use(errorHandler(console));

        const port = EnvParser.getPositiveInteger('PORT', 5003);

        httpServer = app.listen(port, () => {
            console.log(`Servidor CoffeeShop escuchando en el puerto ${port}`);
        });

        const shutdown = signal => {
            console.log(`${signal} recibido. Cerrando CoffeeShop...`);

            httpServer.close(async () => {
                await mongoose.disconnect();
                process.exit(0);
            });
        };

        process.once('SIGINT', () => shutdown('SIGINT'));
        process.once('SIGTERM', () => shutdown('SIGTERM'));
    } catch (error) {
        console.error('Error al iniciar el servidor:', error.message);
        process.exitCode = 1;
    }
}

server();
