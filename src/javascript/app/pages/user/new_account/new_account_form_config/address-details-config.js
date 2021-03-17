const localize = require('../../../../../_common/localize').localize;
// import { generateValidationFunction, getDefaultFields, getErrorMessages } from '@deriv/shared';
const AddressDetailForm = require('../new_account_modules/address_detail_form');

const getAddressDetailsConfig = ({ account_settings }) => {
    if (!account_settings) {
        return {};
    }

    return [
        {
            id           : 'address_line_1',
            section      : 'address_section',
            supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.address_line_1 || '',
            rules        : ['req', 'address', ['length', { min: 1, max: 700 }]],
            // ['po_box', getErrorMessages().po_box()],
            // ].filter(x => (is_svg ? x.indexOf('po_box') !== 0 : x)),
        },
        {
            id           : 'address_line_2',
            section      : 'address_section',
            supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.address_line_2 || '',
            rules        : [['length', { min: 0, max: 70 }]],
            // ['po_box', getErrorMessages().po_box()],
            // ].filter(x => (is_svg ? x.indexOf('po_box') !== 0 : x)),
        },
        {
            id           : 'address_city',
            section      : 'address_section',
            supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.address_city || '',
            rules        : [
                'req',
                ['regular', { regex: /^[a-zA-Z\s\W'.-]{1,35}$/ }],
            ],
        },
        {
            id           : 'address_state',
            section      : 'address_section',
            supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.address_state || '',
            // Isle of Man Clients do not need to fill out state since API states_list is empty.
            rules        : account_settings.residence === 'im' ? [] : ['req', ['regular', { regex: /^[\w\s\W'.-;,]{0,60}$/ }]],
        },
        {
            id           : 'address_postcode',
            section      : 'address_section',
            supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.address_postcode || '',
            // GB residence are required to fill in the post code.
            rules        : [
                ['length', { min: 0, max: 20 }],
                ...(/^(im|gb)$/.test(account_settings.residence) ? ['req'] : []),
                // ['postcode', getErrorMessages().postcode()],
            ],
        },
    ];
};

const getRequiredFields = (landing_company, all_fields) =>
    all_fields.filter(field => field.supported_in.includes(landing_company));

const addressDetailsConfig = ({ upgrade_info, real_account_signup_target, account_settings }) => {
    const is_svg = upgrade_info && upgrade_info.can_upgrade_to === 'svg';
    const config = getAddressDetailsConfig({ account_settings, is_svg });
    return {
        title           : localize('Address'),
        body_module     : AddressDetailForm,
        body_module_step: 'address_detail_step',
        fields          : getRequiredFields(real_account_signup_target, config),
    };
};

module.exports = addressDetailsConfig;
