const CommonBirthdaySpecification = require(
    '@coffeeshop/common/Specifications/BirthdaySpecification'
);

const MIN_PATIENT_BIRTHDAY = '1930-01-01';

// Política de CoffeeShop para las fechas de nacimiento de personas.
class BirthdaySpecification {
    static isSatisfiedBy(birthday, options = {}) {
        return CommonBirthdaySpecification.isSatisfiedBy(birthday, {
            ...options,
            minDate: MIN_PATIENT_BIRTHDAY
        });
    }

    static ensureIsValid(birthday, options = {}) {
        if (!this.isSatisfiedBy(birthday, options)) {
            throw new Error(`Invalid birthday: ${birthday}`);
        }
    }
}

module.exports = BirthdaySpecification;
