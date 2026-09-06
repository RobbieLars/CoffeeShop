import React, { useState } from 'react';
import DashboardController from './Controllers/DashboardController';
import DashboardBuilder from './Helpers/DashboardBuilder';
import DashboardRouteBuilder from './Routes/Common/DashboardRouteBuilder';
import DashboardView from './Views/Common/DashboardView';

import DashboardContentView from './Views/Dashboard/DashboardContentView';
import ProductsView from './Views/Products/ProductsView';
import PetsView from './Views/Pets/PetsView';
import CommentsView from './Views/Comments/CommentsView';
import PurchasesView from './Views/Purchases/PurchasesView';

import { PAGE_KEYS, pageRegistry } from './config/pageRegistry';
import { petController } from './config/PetComposition';
const routeBuilder = new DashboardRouteBuilder(pageRegistry);
const dashboardBuilder = new DashboardBuilder(routeBuilder);
const dashboardController = new DashboardController(dashboardBuilder);

function App() {
    const [activePath, setActivePath] = useState('/');

    const handleNavigate = (path) => {
        if (path) {
            setActivePath(path);
        }
    };

    const handleLogout = () => {
        const confirmed = window.confirm('¿Estás seguro de que deseas cerrar sesión?');
        if (confirmed) {
            console.log('Sesión cerrada.');
            // Aquí se puede redirigir al login o limpiar tokens/cookies de autenticación
            alert('Has cerrado sesión correctamente.');
        }
    };

    const dashboard = dashboardController.index({
        appKey: 'coffeeshop',
        pageTitle: getPageTitle(activePath),
        brand: {
            name: 'CoffeeShop',
            shortName: 'CS',
            contextLabel: 'Aplicación',
            description: 'Administración de la cafetería'
        },
        user: {
            displayName: 'Usuario Demo',
            roles: ['Administrador'],
            online: true
        },
        authorizedPages: [
            {
                pageKey: PAGE_KEYS.DASHBOARD_INDEX,
                path: '/',
                module: 'common',
                enabled: true
            },
            {
                pageKey: PAGE_KEYS.PRODUCTS_INDEX,
                path: '/products',
                module: 'products',
                enabled: true
            },
            {
                pageKey: PAGE_KEYS.PETS_INDEX,
                path: '/pets',
                module: 'pets',
                enabled: true
            },
            {
                pageKey: PAGE_KEYS.COMMENTS_INDEX,
                path: '/comments',
                module: 'comments',
                enabled: true
            },
            {
                pageKey: PAGE_KEYS.PURCHASES_INDEX,
                path: '/purchases',
                module: 'purchases',
                enabled: true
            }
        ],
        menuItems: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                pageKey: PAGE_KEYS.DASHBOARD_INDEX,
                icon: 'ti ti-layout-dashboard',
                orderIndex: 0,
                enabled: true
            },
            {
                id: 'products',
                title: 'Productos',
                pageKey: PAGE_KEYS.PRODUCTS_INDEX,
                icon: 'ti ti-coffee',
                orderIndex: 1,
                enabled: true
            },
            {
                id: 'pets',
                title: 'Mascotas',
                pageKey: PAGE_KEYS.PETS_INDEX,
                icon: 'ti ti-paw',
                orderIndex: 2,
                enabled: true
            },
            {
                id: 'comments',
                title: 'Comentarios',
                pageKey: PAGE_KEYS.COMMENTS_INDEX,
                icon: 'ti ti-message-2',
                orderIndex: 3,
                enabled: true
            },
            {
                id: 'purchases',
                title: 'Mis Compras',
                pageKey: PAGE_KEYS.PURCHASES_INDEX,
                icon: 'ti ti-shopping-cart',
                orderIndex: 4,
                enabled: true
            }
        ],
        activePath
    });

    const renderActiveContent = () => {
        switch (activePath) {
            case '/products':
                return <ProductsView />;
            case '/pets':
                return <PetsView controller={petController} />;
            case '/comments':
                return <CommentsView />;
            case '/purchases':
                return <PurchasesView />;
            case '/':
            default:
                return <DashboardContentView />;
        }
    };

    return (
        <DashboardView
            viewModel={dashboard}
            onNavigate={handleNavigate}
            onSearch={(query) => console.log('Buscando:', query)}
            onLogout={handleLogout}
        >
            {renderActiveContent()}
        </DashboardView>
    );
}

function getPageTitle(path) {
    switch (path) {
        case '/products':
            return 'Productos';
        case '/pets':
            return 'Mascotas';
        case '/comments':
            return 'Comentarios';
        case '/purchases':
            return 'Mis Compras';
        case '/':
        default:
            return 'Dashboard';
    }
}

export default App;
