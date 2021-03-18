const SelectMatcher = require('@binary-com/binary-style').select2Matcher;
const moment = require('moment');
const Client = require('../../../../base/client');
const generateBirthDate = require('../../../../../app/common/attach_dom/birth_date_picker');
const BinarySocket = require('../../../../base/socket');
const getElementById = require('../../../../../_common/common_functions').getElementById;
const makeOption = require('../../../../../_common/common_functions').makeOption;
const State = require('../../../../../_common/storage').State;

const PersonalDetailForm = (() => {

    const init = async (fields) => {
        const residence_list = (await BinarySocket.wait('residence_list')).residence_list;
        const client_residence = Client.get('residence') || '';
        const landing_company = State.getResponse('landing_company');

        const $options = $('<div/>');
        const $options_with_disabled = $('<div/>');
        residence_list.forEach((residence) => {
            $options.append(makeOption({ text: residence.text, value: residence.value }));
            $options_with_disabled.append(makeOption({
                text       : residence.text,
                value      : residence.value,
                is_disabled: residence.disabled,
            }));
        });

        const residence_select_fields = ['place_of_birth', 'citizen', 'tax_residence'];
        const simple_select_fields = ['salutation', 'account_opening_reason']
        const text_fields = ['first_name', 'last_name', 'tax_identification_number'];

        fields.forEach(field => {
            if (residence_select_fields.includes(field.id)) {
                $(`#${field.id}`).html((field.id === 'tax_residence' ? $options_with_disabled : $options).html()).val(field.default_value);
                $(`#${field.id}`).select2({
                    matcher(params, data) {
                        return SelectMatcher(params, data);
                    },
                });
            }
            if (simple_select_fields.includes(field.id)) {
                getElementById(field.id).value = field.default_value;
            }
            if (text_fields.includes(field.id)) {
                $(`#${field.id}`).text(field.default_value);
                $(`#${field.id}`)
                    .val(field.default_value) // Set value for validation
                    .attr({ 'data-force': true, 'data-value': field.default_value });
            }
            if (field.id === 'date_of_birth') {
                generateBirthDate(landing_company.minimum_age);
                if (field.default_value !== '') {
                    $(`#${field.id}`)
                        .attr('data-value', field.default_value)
                        .val(moment(field.default_value).format('DD MMM, YYYY'));
                }
            }
            if (field.id === 'phone') {
                const residence_phone_idd =
                    residence_list.find(residence => residence.value === client_residence).phone_idd;
                $(`#${field.id}`).val(field.default_value !== '' ? field.default_value : `+${residence_phone_idd}`);
            }
            getElementById(`${field.section}_section`).setVisibility(1);
            getElementById(`${field.id}_row`).setVisibility(1);
        });
    };

    return {
        init,
    };
})();

module.exports = PersonalDetailForm;
