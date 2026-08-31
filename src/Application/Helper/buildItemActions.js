// Función para construir un array de acciones permitidas para un item, basado en las reglas definidas y el contexto proporcionado.

function buildItemActions({
    actions = [],
    rules = {},
    context = null
} = {}) {
    if (!Array.isArray(actions)) {
        return [];
    }

    const uniqueActions = [...new Set(actions)];

    return uniqueActions.filter(action => {
        if (typeof action !== 'string' || action.trim() === '') {
            return false;
        }

        const rule = rules[action];

        // Si no existe regla, la acción está permitida.
        if (typeof rule !== 'function') {
            return true;
        }

        return rule(context) === true;
    });
}

module.exports = buildItemActions;
