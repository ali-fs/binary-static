const SelectMatcher = require('@binary-com/binary-style').select2Matcher;
const Client = require('../../../../base/client');
const BinarySocket = require('../../../../base/socket');
const getElementById = require('../../../../../_common/common_functions').getElementById;
const makeOption = require('../../../../../_common/common_functions').makeOption;
const localize = require('../../../../../_common/localize').localize;

const AddressDetailForm = (() => {

    const init = async (fields) => {
        if (fields.some(field => field.id === 'address_state')) {
            let $address_state = $('#address_state');
            const client_state = (await BinarySocket.send({ get_settings: 1 })).get_settings.address_state
            const state_list = (await BinarySocket.send({ states_list: Client.get('residence') })).states_list;
            if (state_list && state_list.length > 0) {
                $address_state.append(makeOption({ text: localize('Please select'), value: '' }))
                state_list.forEach((state) => { $address_state.append(makeOption({ text: state.text, value: state.value })); });
                $address_state.select2({
                    matcher(params, data) {
                        return SelectMatcher(params, data);
                    },
                });
                if (client_state) $address_state.val(client_state);
            } else {
                $address_state.replaceWith($('<input/>', { id: 'address_state', name: 'address_state', type: 'text', maxlength: '35', 'data-lpignore': true }));
                $address_state = $('#address_state');
                if (client_state) $address_state.text(client_state);
            }
        }

        const texts = ['address_line_1', 'address_line_2', 'address_city', 'address_postcode']

        fields.forEach(field => {
            if (texts.includes(field.id)) {
                $(`#${field.id}`).text(field.default_value);
                $(`#${field.id}`)
                    .val(field.default_value) // Set value for validation
                    .attr({ 'data-force': true, 'data-value': field.default_value });
            }

            getElementById(`${field.section}_section`).setVisibility(1)
            getElementById(`${field.id}_row`).setVisibility(1)
        })
    };

    return {
        init,
    };

})();

module.exports = AddressDetailForm;
