const moment = require('moment');
const localize = require('../../../../../_common/localize').localize;
const PersonalDetailForm = require('../new_account_modules/personal_detail_form');

// import { toMoment, getErrorMessages, generateValidationFunction, getDefaultFields, validLength } from '@deriv/shared';

const getCountryName = (residence_list, countryCode) => {
    const country = residence_list.find(item => item.value === countryCode);
    return country ? country.text : '';
};
const getPersonalDetailsConfig = ({ residence_list, account_settings }) => {
    if (!residence_list || !account_settings) {
        return {};
    }

    // minimum characters required is 9 numbers (excluding +- signs or space)
    // const min_phone_number = 9;
    // const max_phone_number = 35;

    const config = [

        {
            id           : 'salutation',
            section      : 'name',
            supported_in : ['iom', 'malta', 'maltainvest'],
            default_value: account_settings.salutation || '',
            rules        : ['req'],
        },
        {
            id           : 'first_name',
            section      : 'name',
            supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.first_name || '',
            rules        : ['req', 'letter_symbol', ['length', { min: 2, max: 50 }]],
        },
        {
            id           : 'last_name',
            section      : 'name',
            supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.last_name || '',
            rules        : ['req', 'letter_symbol', ['length', { min: 2, max: 50 }]],
        },
        {
            id           : 'date_of_birth',
            section      : 'detail',
            supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.date_of_birth
                ? moment.utc(account_settings.date_of_birth * 1000)
                : '',
            rules: ['req'],
        },
        {
            id           : 'place_of_birth',
            section      : 'detail',
            supported_in : ['maltainvest', 'iom', 'malta'],
            default_value: account_settings.place_of_birth
                ? getCountryName(residence_list, account_settings.place_of_birth)
                : account_settings.country_code,
            rules: ['req'],
        },
        {
            id           : 'citizen',
            section      : 'detail',
            supported_in : ['iom', 'malta', 'maltainvest'],
            default_value: account_settings.citizen
                ? getCountryName(residence_list, account_settings.citizen)
                : account_settings.country_code,
            rules: ['req'],
        },
        {
            id           : 'phone',
            section      : 'detail',
            supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.phone || '',
            rules        : ['req', 'phone', ['length', { min: 9, max: 35, value: () => $('#phone').val().replace(/\D/g, '') }]],
        },
        {
            id           : 'tax_residence',
            section      : 'tax',
            supported_in : ['maltainvest'],
            default_value: account_settings.tax_residence
                ? getCountryName(residence_list, account_settings.tax_residence)
                : account_settings.country_code,
            rules: ['req', ['length', { min: 1, max: 20 }]],
        },
        {
            id           : 'tax_identification_number',
            section      : 'tax',
            supported_in : ['maltainvest'],
            default_value: account_settings.tax_identification_number || '',
            rules        : [
                'req',
                ['tax_id', { $warning: $('#tax_id_warning'), $tax_residence: $('#tax_residence') }],
                ['length', { min: 1, max: 20 }],
            ],
        },
        {
            id           : 'tax_identification_confirm',
            section      : 'tax',
            supported_in : ['maltainvest'],
            default_value: false,
            rules        : ['req'],
        },
        {
            id           : 'account_opening_reason',
            section      : 'account_opening_reason',
            supported_in : ['iom', 'malta', 'maltainvest'],
            default_value: account_settings.account_opening_reason || '',
            rules        : ['req'],
        },
    ];

    return config;
};

const getRequiredFields = (landing_company, all_fields) =>
    all_fields.filter(field => field.supported_in.includes(landing_company));

const personalDetailsConfig = ({
    real_account_signup_target,
    residence_list, account_settings,
}) => {
    const config = getPersonalDetailsConfig({ residence_list, account_settings });
    return {
        title           : localize('Personal details'),
        body_module     : PersonalDetailForm,
        body_module_step: 'personal_detail_step',
        fields          : getRequiredFields(real_account_signup_target, config),
    };
};

module.exports = personalDetailsConfig;
