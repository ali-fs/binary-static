const getSteps = require('./new_account_form_config/wizard-step-config');
const Client = require('../../../base/client');
const BinarySocket = require('../../../base/socket');
const AccountOpening = require('../../../common/account_opening');
const FormManager = require('../../../common/form_manager');
const FormProgress = require('../../../common/form_progress');
const getElementById = require('../../../../_common/common_functions').getElementById;
const param = require('../../../../_common/url').param;
const { localize } = require('../../../../_common/localize');

const RealAccountOpening = (() => {
    let real_account_signup_target,
        steps,
        current_step,

        action_previous_buttons;

    const onLoad = async () => {
        real_account_signup_target = param('account_type');

        const residence_list_promise = BinarySocket.send({ residence_list: 1 });
        const account_settings_promise = BinarySocket.send({ get_settings: 1 });
        const financial_assessment_promise = BinarySocket.send({ get_financial_assessment: 1 });

        const [residence_list_response, account_settings_response, financial_assessment_response] =
            await Promise.all([residence_list_promise, account_settings_promise, financial_assessment_promise]);
        const account_settings = account_settings_response.get_settings;
        const residence_list = residence_list_response.residence_list;
        const financial_assessment = financial_assessment_response.get_financial_assessment || {};
        const upgrade_info = Client.getUpgradeInfo();

        action_previous_buttons = document.getElementsByClassName('action_previous');
        Array.from(action_previous_buttons).forEach((item) => {
            item.addEventListener('click', onClickPrevious);
        });

        steps = getSteps({
            real_account_signup_target,
            residence_list,
            account_settings,
            upgrade_info,
            financial_assessment,
        });
        current_step = 0;
        steps.forEach(step => {
            step.body_module.init(step.fields, real_account_signup_target);
        });
        getElementById('page_title').innerHTML = real_account_signup_target === 'maltainvest' ?
            localize('Financial Account Opening') :
            localize('Gaming Account Opening');
        getElementById('loading').setVisibility(0);
        getElementById('real_account_wrapper').setVisibility(1);
        renderStep();

    };

    const renderStep = (previous_step = 0) => {
        FormProgress.render('form_progress', steps, current_step);

        if (previous_step >= 0) getElementById(steps[previous_step].body_module_step).setVisibility(0);
        getElementById(steps[current_step].body_module_step).setVisibility(1);

        FormManager.init(`#${steps[current_step].body_module_step}_form`, getValidationRules(steps[current_step]));
        FormManager.handleSubmit({
            form_selector     : `#${steps[current_step].body_module_step}_form`,
            get_submitted_data: onStepSubmitted,
        });
    };

    const onStepSubmitted = () => {
        if (current_step === steps.length - 1) {
            // alert('submit data');
        } else {
            current_step++;
            renderStep(current_step - 1);
        }
    };

    const onClickPrevious = () => {
        current_step--;
        renderStep(current_step + 1);
    };

    const getValidationRules = (step) => step.fields.map(field => ({
        selector   : `#${field.id}`,
        validations: field.rules,
    }));

    const onUnload = () => { AccountOpening.showHidePulser(1); };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = RealAccountOpening;
