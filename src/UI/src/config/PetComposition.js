import PetMockService from '@coffeeshop/pet-mock-service';
import PetController from '../Controllers/PetController';

const petDataSource = new PetMockService();

const petController = new PetController(petDataSource);

export {
    petController,
    petDataSource
};
