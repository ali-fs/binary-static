// import { isDesktop, getDefaultFields } from '@deriv/shared';
const localize = require('../../../../../_common/localize').localize;
const TermsOfUseForm = require('../new_account_modules/terms_of_use_form');

const getTermsOfUseConfig = [
    {
        id           : 'agreed_tos',
        section      : 'terms_of_use_section',
        supported_in : ['svg', 'iom'],
        default_value: false,
        rules        : ['req'],
    },
    {
        id           : 'agreed_tnc',
        section      : 'terms_of_use_section',
        supported_in : ['svg', 'iom'],
        default_value: false,
        rules        : ['req'],
    },
];

const getRequiredFields = (landing_company, all_fields) =>
    all_fields.filter(field => field.supported_in.includes(landing_company));

const termsOfUseConfig = ({ real_account_signup_target }) => ({
    title           : localize('Terms of use'),
    body_module     : TermsOfUseForm,
    body_module_step: 'terms_of_use_step',
    fields          : getRequiredFields(real_account_signup_target, getTermsOfUseConfig),
});

module.exports = termsOfUseConfig;
