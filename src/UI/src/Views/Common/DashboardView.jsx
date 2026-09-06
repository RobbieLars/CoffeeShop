import AppLayout from '@common-ui/Components/AppLayout/AppLayout.jsx';
import TopHeader from '@common-ui/Components/AppLayout/TopHeader.jsx';
import MultiLevelMenu from '@common-ui/Components/MultiLevelMenu/MultiLevelMenu.jsx';
import useAppLayout from '@common-ui/Components/AppLayout/useAppLayout.js';
import '../../wwwroot/css/Common/DashboardView.css';

function DashboardView({
    viewModel,
    children = null,
    onNavigate,
    onSearch,
    onLogout,
    showThemeToggle = true
}) {
    const layout = useAppLayout();

    const navigateToMenuItem = (item, event) => {
        if (!onNavigate || !item.path) {
            return;
        }

        event.preventDefault();
        onNavigate(item.path, item);
        layout.closeSidebar();
    };

    const sidebar = (
        <div className="dashboard-sidebar">
            <a className="dashboard-brand" href={viewModel.brand.homePath}>
                <span className="dashboard-brand__mark" aria-hidden="true">
                    {viewModel.brand.icon ?? viewModel.brand.shortName}
                </span>
                <span>{viewModel.brand.name}</span>
            </a>

            <div className="dashboard-context" aria-label="Contexto actual">
                <span className="dashboard-context__label">
                    {viewModel.brand.contextLabel}
                </span>
                <strong>{viewModel.brand.name}</strong>
                <small>{viewModel.brand.description}</small>
            </div>

            <div className="dashboard-navigation">
                <span className="dashboard-navigation__title">
                    Menú principal
                </span>

                <MultiLevelMenu
                    items={viewModel.menuItems}
                    activePath={viewModel.activePath}
                    className="coffeeshop-menu"
                    onItemClick={navigateToMenuItem}
                />
            </div>
        </div>
    );

    const header = (
        <TopHeader
            user={viewModel.user}
            onSearch={onSearch}
            searchPlaceholder="Buscar en CoffeeShop"
            searchIcon="ti ti-search"
            searchShortcut="Ctrl K"
            menuIcon="ti ti-menu-2"
            onMenuToggle={layout.toggleSidebar}
            menuExpanded={layout.sidebarOpen}
            showThemeToggle={showThemeToggle}
            profileItems={onLogout
                ? [{
                    id: 'logout',
                    label: 'Cerrar sesión',
                    danger: true,
                    onClick: onLogout
                }]
                : []}
        />
    );

    return (
        <AppLayout
            sidebar={sidebar}
            header={header}
            sidebarOpen={layout.sidebarOpen}
            onSidebarClose={layout.closeSidebar}
            className="coffeeshop-dashboard"
        >
            <header className="dashboard-page-header">
                <h1>{viewModel.pageTitle}</h1>
            </header>

            <section className="dashboard-page-content">
                {children ?? (
                    <div className="dashboard-empty-state">
                        <strong>Área de contenido</strong>
                        <p>
                            Las vistas autorizadas se mostrarán en este espacio.
                        </p>
                    </div>
                )}
            </section>
        </AppLayout>
    );
}

export default DashboardView;
