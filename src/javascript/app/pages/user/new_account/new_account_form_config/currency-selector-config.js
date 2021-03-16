const localize = require('../../../../../_common/localize').localize;
const CurrencyForm = require('../new_account_modules/currency_form');

const currency_selector_fields = [
    {
        id: 'currency',
        supported_in: ['maltainvest', 'malta', 'svg', 'iom'],
        default_value: '',
        rules: [['custom', {
            value: () => $('.selected').find('.currency-name').text(),
            func: (value) => value !== '',
            message: 'Please select the currency for this account.'
        }]],
    }
]

const getRequiredFields = (landing_company, all_fields) => {
    return all_fields.filter(field => field.supported_in.includes(landing_company))
};

const currencySelectorConfig = ({ real_account_signup_target }, CurrencySelector) => {
    return {
        title: localize('Account currency'),
        body_module: CurrencyForm,
        body_module_step: 'currency_step',
        fields: getRequiredFields(real_account_signup_target, currency_selector_fields),
    };
};

module.exports = currencySelectorConfig;
