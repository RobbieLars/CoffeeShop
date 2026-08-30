import DashboardController from './Controllers/DashboardController';
import DashboardBuilder from './Helpers/DashboardBuilder';
import DashboardRouteBuilder from './Routes/Common/DashboardRouteBuilder';
import DashboardView from './Views/Common/DashboardView';
import { PAGE_KEYS, pageRegistry } from './config/pageRegistry';

const routeBuilder = new DashboardRouteBuilder(pageRegistry);
const dashboardBuilder = new DashboardBuilder(routeBuilder);
const dashboardController = new DashboardController(dashboardBuilder);

function App() {
    const dashboard = dashboardController.index({
        appKey: 'coffeeshop',
        pageTitle: 'Dashboard',
        brand: {
            name: 'CoffeeShop',
            shortName: 'CS',
            contextLabel: 'Aplicación',
            description: 'Administración de la cafetería'
        },
        user: {
            displayName: 'Usuario',
            roles: []
        },
        authorizedPages: [{
            pageKey: PAGE_KEYS.DASHBOARD_INDEX,
            path: '/',
            module: 'common',
            enabled: true
        }],
        menuItems: [{
            id: 'dashboard',
            title: 'Dashboard',
            pageKey: PAGE_KEYS.DASHBOARD_INDEX,
            icon: 'ti ti-layout-dashboard',
            orderIndex: 0,
            enabled: true
        }, {
            id: 'administration',
            title: 'Administración',
            icon: 'ti ti-settings',
            orderIndex: 1,
            enabled: true,
            children: [{
                id: 'applications',
                title: 'Productos',
                disabled: true
            }, {
                id: 'roles',
                title: 'Comentarios',
                disabled: true
            }, {
                id: 'users',
                title: 'Compras',
                disabled: true
            }]
        }, {
            id: 'users',
            title: 'Usuarios',
            icon: 'ti ti-users',
            orderIndex: 2,
            enabled: true,
            disabled: true
        }],
        activePath: window.location.pathname
    });

    return (
        <DashboardView
            viewModel={dashboard}
            onSearch={() => {}}
        />
    );
}

export default App;
