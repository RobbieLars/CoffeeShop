// ageHelper.js

function calculateAge(birthday, referenceDate = new Date()) {
    if (!birthday) {
        return null;
    }

    const birthDate = toDateWithoutUtcShift(birthday);
    const currentDate = new Date(referenceDate);

    if (
        Number.isNaN(birthDate.getTime()) ||
        Number.isNaN(currentDate.getTime())
    ) {
        return null;
    }

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
        age -= 1;
    }

    return age;
}

function toDateWithoutUtcShift(value) {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split('-').map(Number);

        if (
            month < 1 ||
            month > 12 ||
            day < 1 ||
            day > new Date(year, month, 0).getDate()
        ) {
            return new Date(Number.NaN);
        }

        return new Date(year, month - 1, day);
    }

    return new Date(value);
}

module.exports = {
    calculateAge
};
