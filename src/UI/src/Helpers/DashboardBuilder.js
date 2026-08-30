import DashboardViewModel from '../ViewModels/DashboardViewModel';

class DashboardBuilder {
    constructor(routeBuilder) {
        if (!routeBuilder) {
            throw new Error('DashboardBuilder requiere DashboardRouteBuilder.');
        }

        this._routeBuilder = routeBuilder;
    }

    build({
        appKey,
        pageTitle = 'Dashboard',
        brand = {},
        user = {},
        menuItems = [],
        authorizedPages = [],
        activePath = '/'
    } = {}) {
        const routes = this._routeBuilder.build(authorizedPages);
        const pagesByKey = new Map(
            authorizedPages
                .filter(page => page?.pageKey)
                .map(page => [page.pageKey, page])
        );

        return new DashboardViewModel({
            appKey,
            pageTitle,
            brand: this._buildBrand(brand),
            user: this._buildUser(user),
            menuItems: this._buildMenuItems(menuItems, pagesByKey),
            authorizedPages,
            routes,
            activePath
        });
    }

    _buildBrand(brand) {
        return {
            name: brand?.name?.trim() || 'CoffeeShop',
            shortName: brand?.shortName?.trim() || 'CS',
            contextLabel: brand?.contextLabel?.trim() || 'Sistema actual',
            description: brand?.description?.trim() || 'Administración de la cafetería',
            homePath: brand?.homePath || '/',
            icon: brand?.icon ?? null
        };
    }

    _buildUser(user) {
        const roles = Array.isArray(user?.roles)
            ? [...new Set(user.roles.filter(Boolean))]
            : [];

        return {
            id: user?.id ?? null,
            name: user?.displayName?.trim() || user?.name?.trim() || 'Usuario',
            role: roles.length > 0 ? roles.join(', ') : 'Sin rol asignado',
            roles,
            avatar: user?.avatar ?? null,
            online: user?.online === true
        };
    }

    _buildMenuItems(menuItems, pagesByKey, parentKey = 'root') {
        return [...menuItems]
            .filter(item => item?.enabled !== false)
            .sort((left, right) =>
                (left?.orderIndex ?? 0) - (right?.orderIndex ?? 0)
            )
            .flatMap((item, index) => {
                const pageKey = item.pageKey ?? item.page?.pageKey ?? null;
                const page = pageKey ? pagesByKey.get(pageKey) : null;
                const children = this._buildMenuItems(
                    item.children ?? [],
                    pagesByKey,
                    String(item.id ?? `${parentKey}-${index}`)
                );

                if (pageKey && !page && children.length === 0) {
                    return [];
                }

                return [{
                    id: String(item.id ?? `${parentKey}-${index}`),
                    label: item.label ?? item.title ?? '',
                    path: page?.path ?? item.path ?? null,
                    pageKey,
                    icon: item.icon ?? null,
                    disabled: item.disabled === true,
                    children
                }];
            });
    }
}

export default DashboardBuilder;
