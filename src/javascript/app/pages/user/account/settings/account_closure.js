const Metatrader = require('../../metatrader/metatrader');
const BinarySocket = require('../../../../base/socket');
const Client = require('../../../../base/client');
const Currency = require('../../../../common/currency');
const Url = require('../../../../../_common/url');
const getElementById = require('../../../../../_common/common_functions').getElementById;
const localize = require('../../../../../_common/localize').localize;
const hasAccountType = require('../../../../../_common/base/client_base').hasAccountType;

const AccountClosure = (() => {
    let reason_checkbox_list,
        el_form_closure_step_1,
        el_step_2_back,
        el_step_2_submit,
        el_dialog_container,
        el_account_closure_warning,
        el_account_closure_error,
        el_closure_loading,
        el_error_msg,
        el_other_trading_platforms,
        el_suggested_improves,
        el_remain_characters,
        el_deacivate_button,
        el_submit_loading;

    const onLoad = () => {
        reason_checkbox_list = document.getElementsByName('reason-checkbox');
        el_dialog_container = getElementById('dialog_container');
        el_form_closure_step_1 = getElementById('form_closure_step_1');
        el_step_2_back = getElementById('step_2_back');
        el_step_2_submit = getElementById('step_2_submit');
        el_other_trading_platforms = getElementById('other_trading_platforms');
        el_suggested_improves = getElementById('suggested_improves');
        el_remain_characters = getElementById('remain_characters');
        el_account_closure_warning = getElementById('account_closure_warning');
        el_account_closure_error = getElementById('account_closure_error');
        el_closure_loading = getElementById('closure_loading');
        el_deacivate_button = getElementById('deactivate');
        el_error_msg = getElementById('error_msg');
        el_submit_loading = getElementById('submit_loading');

        el_closure_loading.setVisibility(1);
        const hideDialogs = () => {
            el_account_closure_warning.setVisibility(0);
            el_account_closure_error.setVisibility(0);
        };
        hideDialogs();

        const is_virtual = !hasAccountType('real');
        BinarySocket.wait('landing_company').then(() => {
            if (!is_virtual) {
                BinarySocket.send({ statement: 1, limit: 1 });
                BinarySocket.wait('landing_company', 'get_account_status', 'statement').then(async () => {
                    const is_eligible = await Metatrader.isEligible();
                    if (is_eligible) {
                        const MT5_links = document.getElementsByClassName('metatrader-link');
                        Array.from(MT5_links).forEach(MT5_link => { MT5_link.setVisibility(1); });
                    }
                });
            }
            el_closure_loading.setVisibility(0);
            showStep(1);
        }).catch((error) => {
            showFormMessage(error.message);
            el_closure_loading.setVisibility(0);
        });

        const modal_back_items = document.getElementsByClassName('modal-back');
        Array.from(modal_back_items).forEach((item) => {
            item.addEventListener('click', () => {
                hideDialogs();
            });
        });

        el_dialog_container.setVisibility(1);

        el_deacivate_button.addEventListener('click', () => {
            el_account_closure_warning.setVisibility(0);
            deactivate();
        });

        el_form_closure_step_1.addEventListener('submit', (e) => {
            e.preventDefault();
            showStep(2);
        });

        el_step_2_submit.addEventListener('click', (e) => {
            if (!el_step_2_submit.classList.contains('button-disabled')) {
                e.preventDefault();
                el_account_closure_warning.setVisibility(1);
            }
        });

        el_step_2_back.addEventListener('click', () => {
            showStep(1);
            $.scrollTo(0, 500);
        });

        reason_checkbox_list.forEach(element => {
            element.addEventListener('change', () => { onSelectedReasonChange(); });
        });

        el_suggested_improves.addEventListener('input', onTextChanged);
        el_other_trading_platforms.addEventListener('input', onTextChanged);
    };

    const showStep = (step) => {
        Array.from(new Array(3)).forEach((_, index) => {
            getElementById(`step_${index + 1}`).setVisibility(index + 1 === step);
        });
    };

    const onTextChanged = (e) => {
        const regex = new RegExp('^[a-zA-Z0-9., \'-]+$');
        if (!regex.test(e.data) ||
            el_other_trading_platforms.value.length + el_suggested_improves.value.length > 255) {
            document.execCommand('undo');
            return;
        }
        el_remain_characters.innerHTML = localize(
            'Remaining characters: [_1].', 255
            - el_other_trading_platforms.value.length
        - el_suggested_improves.value.length);
    };

    const onSelectedReasonChange = () => {
        const countOfSelectedReasons = getSelectedReasonCount();
        if (countOfSelectedReasons === 0) {
            el_step_2_submit.classList.add('button-disabled');
        } else {
            el_step_2_submit.classList.remove('button-disabled');
        }
        if (countOfSelectedReasons >= 3) {
            reason_checkbox_list.forEach(reason => {
                if (!reason.checked) {
                    reason.disabled = true;
                    reason.classList.add('disable');
                }
            });
        } else {
            reason_checkbox_list.forEach(reason => { reason.disabled = false; });
        }
    };

    const getSelectedReasonCount = () => Array.from(reason_checkbox_list).filter(el => el.checked).length;

    const deactivate = async () => {
        el_submit_loading.setVisibility(1);
        el_step_2_submit.setAttribute('disabled', true);

        const data = { account_closure: 1, reason: getReason() };
        BinarySocket.send(data).then(async (response) => {
            if (response.error) {
                el_submit_loading.setVisibility(0);
                if (response.error.details) {
                    await showErrorPopUp(response);
                    el_account_closure_error.setVisibility(1);
                } else {
                    showFormMessage(response.error.message || localize('Sorry, an error occurred while processing your request.'));
                }
                el_step_2_submit.setAttribute('disabled', false);
            } else {
                el_submit_loading.setVisibility(0);
                showStep(3);
                $.scrollTo(0, 500);

                sessionStorage.setItem('closingAccount', 1);
                setTimeout(() => {
                    // we need to clear all stored client data by performing a logout action and then redirect to home
                    // otherwise it will think that client is still logged in and redirect to trading page
                    Client.sendLogoutRequest(false, Url.urlFor('home'));
                }, 10000);
            }
        });
    };

    const showErrorPopUp = async (response) => {
        const mt5_login_list = (await BinarySocket.wait('mt5_login_list')).mt5_login_list;
        // clear all previously added details first
        const $error_modal = $('#account_closure_error');
        $error_modal.find('.account-closure-details').remove();
        const $parent = $('<div/>', { class: 'gr-padding-10 gr-child account-closure-details' });
        let section_id = '';
        let display_name = '';
        const addSection = (account, info) => {
            const $section = $parent.clone();
            $section
                .append($('<div />')
                    .append($('<strong />', { text: display_name }))
                    .append($('<div />', { text: account.replace(/^MT[DR]?/i, '') })))
                .append($('<span />', { text: info }));
            $error_modal.find(section_id).setVisibility(1).append($section);
        };
        const getMTDisplay = (account) => {
            const mt5_group = (mt5_login_list.find(acc => acc.login === account) || {}).group;
            return Client.getMT5AccountDisplay(mt5_group);
        };
        if (response.error.details.open_positions) {
            Object.keys(response.error.details.open_positions).forEach((account) => {
                const txt_positions = `${response.error.details.open_positions[account]} position(s)`;
                if (/^MT/.test(account)) {
                    section_id = '#account_closure_open_mt';
                    display_name = getMTDisplay(account);
                } else {
                    section_id = '#account_closure_open';
                    display_name = Client.get('currency', account);
                }
                addSection(account, txt_positions);
            });
        }
        if (response.error.details.balance) {
            Object.keys(response.error.details.balance).forEach((account) => {
                const txt_balance = `${response.error.details.balance[account].balance} ${response.error.details.balance[account].currency}`;
                if (/^MT/.test(account)) {
                    section_id = '#account_closure_balance_mt';
                    display_name = getMTDisplay(account);
                } else {
                    section_id = '#account_closure_balance';
                    display_name = Currency.getCurrencyName(response.error.details.balance[account].currency);
                }
                addSection(account, txt_balance);
            });
        }
    };

    const showFormMessage = (localized_msg, scroll_on_error) => {
        if (scroll_on_error) $.scrollTo($('#reason'), 500, { offset: -20 });
        el_error_msg.setAttribute('class', 'errorfield');
        el_error_msg.innerHTML = localized_msg;
        el_error_msg.style.display = 'block';
    };

    const getReason = () => {
        const selectedReasons = [];
        reason_checkbox_list.forEach(reason => {
            if (reason.checked) {
                selectedReasons.push($(`label[for=${reason.id}]`).text());
            }
        });
        if (el_other_trading_platforms.value.length !== 0) {
            selectedReasons.push(el_other_trading_platforms.value);
        }
        if (el_suggested_improves.value.length !== 0) {
            selectedReasons.push(el_suggested_improves.value);
        }
        return selectedReasons.toString();
    };

    return {
        onLoad,
    };
})();

module.exports = AccountClosure;
