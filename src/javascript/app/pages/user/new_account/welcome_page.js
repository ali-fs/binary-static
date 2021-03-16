const BinarySocket = require('../../../base/socket');
const Client = require('../../../base/client');
const getElementById = require('../../../../_common/common_functions').getElementById;
const Url = require('../../../../_common/url');

const WelcomePage = (() => {
    const onLoad = () => {
        BinarySocket.wait('authorize', 'landing_company', 'get_settings').then(() => {
            getElementById('default').addEventListener('click', () => {
                window.location.href = Client.defaultRedirectUrl();
            })
            getElementById('mt5').addEventListener('click', () => {
                window.location.href = Url.urlFor('/user/metatrader');
            })
        });
    };

    return {
        onLoad,
    };
})();

module.exports = WelcomePage;
