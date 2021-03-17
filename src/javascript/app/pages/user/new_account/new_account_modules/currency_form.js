const GetCurrency        = require('../../../../pages/user/get_currency');
const Client             = require('../../../../base/client');
const BinarySocket       = require('../../../../base/socket');
const Currency           = require('../../../../common/currency');
const localize           = require('../../../../../_common/localize').localize;
const Url                = require('../../../../../_common/url');

const SetCurrency = (() => {
    let $submit;

    const init = async () => {
        const $currency_list    = $('.currency_list');
        const $error            = $('#set_currency').find('.error-msg');
        const landing_company = (await BinarySocket.wait('landing_company')).landing_company;
        const payout_currencies = (await BinarySocket.wait('payout_currencies')).payout_currencies;
      
        populateCurrencies(getAvailableCurrencies(landing_company, payout_currencies));

        onSelection($currency_list, $error, true);
    };

    const getAvailableCurrencies = (landing_company, payout_currencies) =>
        Client.get('landing_company_shortcode') === 'svg' ? GetCurrency.getCurrencies(landing_company) : payout_currencies;

    const populateCurrencies = (currencies) => {
        const $fiat_currencies  = $('<div/>');
        const $cryptocurrencies = $('<div/>');
        currencies.forEach((c) => {
            const $wrapper = $('<div/>', { class: 'gr-2 gr-4-m currency_wrapper', id: c });
            const $image   = $('<div/>').append($('<img/>', { src: Url.urlForStatic(`images/pages/set_currency/${c.toLowerCase()}.svg`) }));
            const $name    = $('<div/>', { class: 'currency-name' });

            if (Currency.isCryptocurrency(c)) {
                const $display_name = $('<span/>', {
                    text: Currency.getCurrencyName(c) || c,
                    ...(/^UST$/.test(c) && {
                        'data-balloon'       : localize('Tether Omni (USDT) is a version of Tether that\'s pegged to USD and is built on the Bitcoin blockchain.'),
                        'data-balloon-length': 'medium',
                        'data-balloon-pos'   : 'top',
                        'class'              : 'show-mobile',
                    }),
                    ...(/^eUSDT/.test(c) && {
                        'data-balloon'       : localize('Tether ERC20 (eUSDT) is a version of Tether that\'s pegged to USD and is hosted on the Ethereum platform.'),
                        'data-balloon-length': 'medium',
                        'data-balloon-pos'   : 'top',
                        'class'              : 'show-mobile',
                    }),
                });

                $name.append($display_name).append($('<br/>')).append(`(${Currency.getCurrencyDisplayCode(c)})`);
            } else {
                $name.text(c);
            }

            $wrapper.append($image).append($name);
            (Currency.isCryptocurrency(c) ? $cryptocurrencies : $fiat_currencies).append($wrapper);
        });
        const fiat_currencies = $fiat_currencies.html();
        if (fiat_currencies) {
            $('#fiat_currencies').setVisibility(1);
            $('#fiat_currency_list').html(fiat_currencies).parent().setVisibility(1);
        }
        const crypto_currencies = $cryptocurrencies.html();
        if (crypto_currencies) {
            $('#crypto_currencies').setVisibility(1);
            $('#crypto_currency_list').html(crypto_currencies).parent().setVisibility(1);
        }
        const has_one_group = (!fiat_currencies && crypto_currencies) || (fiat_currencies && !crypto_currencies);
        if (has_one_group) {
            $('#set_currency_text').text(localize('Please select the currency for this account:'));
        } else {
            $('#set_currency_text').text(localize('Do you want this to be a fiat account or crypto account? Please choose one:'));
        }

        $('#set_currency_loading').remove();
        $('#set_currency, .select_currency').setVisibility(1);
    };

    const onSelection = ($currency_list, $error) => {
        $('.currency_wrapper').off('click dblclick').on('click dblclick', function () {
            removeError($error, true);
            const $clicked_currency = $(this);
            $currency_list.find('> div').removeClass('selected');
            $clicked_currency.addClass('selected');
        });
    };

    // const onConfirm = ($currency_list, $error, should_create_account) => {
    //     removeError($error);
    //     const $selected_currency = $currency_list.find('.selected');
    //     if ($selected_currency.length) {
    //         const selected_currency = $selected_currency.attr('id');
    //         let request = {};
    //         if (should_create_account) {
    //             request = populateReqMultiAccount(selected_currency);
    //         } else {
    //             request = { set_account_currency: selected_currency };
    //         }
    //         BinarySocket.send(request).then((response_c) => {
    //             if ($submit) {
    //                 $submit.removeClass('button-disabled');
    //             }
    //             if (response_c.error) {
    //                 if (popup_action === 'multi_account' && /InsufficientAccountDetails|InputValidationFailed/.test(response_c.error.code)) {
    //                     cleanupPopup();
    //                     setIsForNewAccount(true);
    //                     // ask client to set any missing information
    //                     BinaryPjax.load(Url.urlFor('user/settings/detailsws'));
    //                 } else {
    //                     $error.text(response_c.error.message).setVisibility(1);
    //                 }
    //             } else {
    //                 const previous_currency = Client.get('currency');
    //                 // Use the client_id while creating a new account
    //                 const new_account_loginid = popup_action === 'multi_account' ? response_c.new_account_real.client_id : undefined;
    //                 Client.set('currency', selected_currency, new_account_loginid);
    //                 BinarySocket.send({ balance: 1 });
    //                 BinarySocket.send({ payout_currencies: 1 }, { forced: true });
    //                 Header.displayAccountStatus();

    //                 if (typeof onConfirmAdditional === 'function') {
    //                     onConfirmAdditional();
    //                 }

    //                 let redirect_url;
    //                 if (is_new_account) {
    //                     if (Client.isAccountOfType('financial')) {
    //                         const get_account_status = State.getResponse('get_account_status');
    //                         if (!/authenticated/.test(get_account_status.status)) {
    //                             redirect_url = Url.urlFor('user/authenticate');
    //                         }
    //                     }
    //                     // Do not redirect MLT clients to cashier, because they need to set self exclusion before trading
    //                     if (!redirect_url && /^(malta)$/i.test(Client.get('landing_company_shortcode'))) {
    //                         redirect_url = Url.urlFor('user/security/self_exclusionws');
    //                     }
    //                     // Do not redirect MX clients to cashier, because they need to set max limit before making deposit
    //                     if (!redirect_url && !/^(iom)$/i.test(Client.get('landing_company_shortcode'))) {
    //                         redirect_url = Url.urlFor('cashier');
    //                     }
    //                 } else if (/[set|change]_currency/.test(popup_action)) {
    //                     const previous_currency_display = Currency.getCurrencyDisplayCode(previous_currency);
    //                     const selected_currency_display = Currency.getCurrencyDisplayCode(selected_currency);
    //                     $('.select_currency').setVisibility(0);
    //                     $('#congratulations_message').html(
    //                         popup_action === 'set_currency' ?
    //                             localize('You have successfully set your account currency to [_1].', [`<strong>${selected_currency_display}</strong>`]) :
    //                             localize('You have successfully changed your account currency from [_1] to [_2].', [ `<strong>${previous_currency_display}</strong>`, `<strong>${selected_currency_display}</strong>` ])
    //                     );
    //                     $('.btn_cancel, #deposit_btn, #set_currency, #show_new_account').setVisibility(1);
    //                     $(`#${Client.get('loginid')}`).find('td[datath="Currency"]').text(selected_currency_display);
    //                 } else if (popup_action === 'multi_account') {
    //                     const new_account = response_c.new_account_real;
    //                     localStorage.setItem('is_new_account', 1);
    //                     cleanupPopup();
    //                     // add new account to store and refresh the page
    //                     Client.processNewAccount({
    //                         email       : Client.get('email'),
    //                         loginid     : new_account.client_id,
    //                         token       : new_account.oauth_token,
    //                         redirect_url: Url.urlFor('user/set-currency'),
    //                     });
    //                     return;
    //                 } else {
    //                     redirect_url = BinaryPjax.getPreviousUrl();
    //                 }

    //                 if (redirect_url) {
    //                     window.location.href = redirect_url; // load without pjax
    //                 } else {
    //                     Header.populateAccountsList(); // update account title
    //                     $('.select_currency').setVisibility(0);
    //                     $('#deposit_btn')
    //                         .off('click dblclick')
    //                         .on('click dblclick', () => {
    //                             if (popup_action) {
    //                                 cleanupPopup();
    //                             }
    //                             BinaryPjax.load(`${Url.urlFor('cashier/forwardws')}?action=deposit`);
    //                         })
    //                         .setVisibility(1);
    //                 }
    //             }
    //         });
    //     } else {
    //         removeError(null, true);
    //         $error.text(localize('Please choose a currency')).setVisibility(1);
    //     }
    // };

    /**
     * Remove error text if $error is defined
     * Enable confirm button if is_btn_enabled is true
     *
     * @param {object} $error // error text jquery element
     * @param {boolean} is_btn_enabled // Enable button
     */
    const removeError = ($error, is_btn_enabled) => {
        if ($error){
            $error.setVisibility(0);
        }
        if ($submit && is_btn_enabled) {
            $submit.removeClass('button-disabled');
        }
    };

    // const populateReqMultiAccount = (selected_currency) => {
    //     const get_settings = State.getResponse('get_settings');

    //     return ({
    //         new_account_real      : 1,
    //         currency              : selected_currency,
    //         date_of_birth         : moment.utc(+get_settings.date_of_birth * 1000).format('YYYY-MM-DD'),
    //         salutation            : get_settings.salutation,
    //         first_name            : get_settings.first_name,
    //         last_name             : get_settings.last_name,
    //         address_line_1        : get_settings.address_line_1,
    //         address_line_2        : get_settings.address_line_2,
    //         address_city          : get_settings.address_city,
    //         address_state         : get_settings.address_state,
    //         address_postcode      : get_settings.address_postcode,
    //         phone                 : get_settings.phone,
    //         account_opening_reason: get_settings.account_opening_reason,
    //         citizen               : get_settings.citizen,
    //         place_of_birth        : get_settings.place_of_birth,
    //         residence             : Client.get('residence'),
    //         ...(get_settings.tax_identification_number && {
    //             tax_identification_number: get_settings.tax_identification_number,
    //         }),
    //         ...(get_settings.tax_residence && {
    //             tax_residence: get_settings.tax_residence,
    //         }),
    //     });
    // };

    const cleanupPopup = () => {
        localStorage.removeItem('popup_action');
        $('.lightbox').remove();
    };

    return {
        init,
        cleanupPopup,
    };
})();

module.exports = SetCurrency;
