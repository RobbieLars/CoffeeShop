// Configuraciones de persistencia para traducir criterios de búsqueda a MongoDB.

const comment = {
    userId: { field: 'userId', type: 'objectId' }
};

const person = {
    name: { field: 'name', type: 'string' },
    secondName: { field: 'secondName', type: 'string' },
    lastName: { field: 'lastName', type: 'string' },
    secondLastName: { field: 'secondLastName', type: 'string' },
    birthDate: { field: 'birthDate', type: 'date' },
    gender: { field: 'gender', type: 'string' },
    email: { field: 'email', type: 'string' }
};

const product = {
    name: { field: 'name', type: 'string' },
    description: { field: 'description', type: 'string' },
    price: { field: 'price', type: 'number' },
    enabled: { field: 'enabled', type: 'boolean' }
};

const purchase = {
    productId: { field: 'productId', type: 'objectId' },
    userId: { field: 'userId', type: 'objectId' },
    date: { field: 'day', type: 'date' }
};

const role = {
    name: { field: 'name', type: 'string' },
    enabled: { field: 'enabled', type: 'boolean' }
};

const user = {
    username: { field: 'username', type: 'string' },
    verified: { field: 'verified', type: 'boolean' },
    personId: { field: 'personId', type: 'objectId' },
    enabled: { field: 'enabled', type: 'boolean' }
};

module.exports = {
    comment,
    person,
    product,
    purchase,
    role,
    user
};
