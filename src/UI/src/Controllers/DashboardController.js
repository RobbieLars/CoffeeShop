class DashboardController {
    constructor(dashboardBuilder) {
        if (!dashboardBuilder) {
            throw new Error('DashboardController requiere DashboardBuilder.');
        }

        this._dashboardBuilder = dashboardBuilder;
    }

    index(data = {}) {
        return this._dashboardBuilder.build(data);
    }
}

export default DashboardController;
