import PurchaseMockService from '@coffeeshop/purchase-mock-service';
import PurchaseController from '../Controllers/PurchaseController';

// Para conectar la API real en producción, únicamente se cambia la fuente:
// import PurchaseClient from '../../../../src/Application/Clients/PurchaseClient.mjs';
// const purchaseDataSource = new PurchaseClient({ baseUrl: '/api' });
const purchaseDataSource = new PurchaseMockService();

const purchaseController = new PurchaseController(purchaseDataSource);

export {
    purchaseController,
    purchaseDataSource
};
