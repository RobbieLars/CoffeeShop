// Modelo preparado exclusivamente para representar el dashboard en la UI.
class DashboardViewModel {
    constructor({
        appKey,
        pageTitle,
        brand,
        user,
        menuItems = [],
        authorizedPages = [],
        routes = [],
        activePath = '/'
    } = {}) {
        this.appKey = appKey;
        this.pageTitle = pageTitle;
        this.brand = brand;
        this.user = user;
        this.menuItems = menuItems;
        this.authorizedPages = authorizedPages;
        this.routes = routes;
        this.activePath = activePath;
    }
}

export default DashboardViewModel;
