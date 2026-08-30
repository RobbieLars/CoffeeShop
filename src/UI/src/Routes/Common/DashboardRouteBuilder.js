class DashboardRouteBuilder {
    constructor(registry = {}) {
        this._registry = registry;
    }

    build(authorizedPages = []) {
        const pageByKey = new Map(
            authorizedPages
                .filter(page => page?.enabled !== false && page?.pageKey)
                .map(page => [page.pageKey, page])
        );

        return Object.values(this._registry).flatMap(definition => {
            const authorizedPage = pageByKey.get(definition.pageKey);

            if (definition.requiresAuthorization !== false && !authorizedPage) {
                return [];
            }

            return [{
                ...definition,
                path: authorizedPage?.path ?? definition.defaultPath,
                module: authorizedPage?.module ?? definition.module ?? null,
                page: authorizedPage ?? null
            }];
        });
    }
}

export default DashboardRouteBuilder;
