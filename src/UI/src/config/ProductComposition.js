import ProductMockService from '@coffeeshop/product-mock-service';
import ProductController from '../Controllers/ProductController';

// Para conectar la API real en producción, únicamente se cambia la fuente:
// import ProductClient from '../../../../src/Application/Clients/ProductClient.mjs';
// const productDataSource = new ProductClient({ baseUrl: '/api' });
const productDataSource = new ProductMockService();

const productController = new ProductController(productDataSource);

export {
    productController,
    productDataSource
};
