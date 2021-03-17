import React from 'react';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';

const options = [
    {
        icon_list    : ['images/pages/welcome/cfd.svg'],
        title        : 'CFD',
        desc         : 'Trade with leverage and low spreads for better returns on successful trades.',
        platform_list: [
            {
                icon       : 'metatrader5',
                title      : 'MetaTrader 5',
                description: 'Earn fixed payouts with options, or trade multipliers to amplify your gains with limited risk.',
            },
        ],
        action_title: 'Trade on MetaTrader 5',
        action_id   : 'mt5',
    },
    {
        icon_list    : ['images/pages/welcome/options.svg', 'images/pages/welcome/multipliers.svg'],
        title        : 'Options and multipliers',
        desc         : 'Earn fixed payouts with options, or trade multipliers to amplify your gains with limited risk.',
        platform_list: [
            {
                icon       : 'metatrader5',
                title      : 'SmartTrader',
                description: 'Trade options with Binary.com\'s legacy trading app.',
            },
            {
                icon       : 'binarybot',
                title      : 'Binary Bot',
                description: 'Trade options with Binary.com\'s legacy trading app.',
            },
        ],
        action_title: 'Get started',
        action_id   : 'default',
    },
];

const Platform = ({ title, description, icon }) => (
    <div className='welcome-content-platform-list-container'>
        <img src={it.url_for(`images/pages/welcome/${icon}.svg`)} />
        <div className='welcome-content-platform'>
            <p className='welcome-content-platform-title'>{title}</p>
            <p className='welcome-content-platform-description'>{description}</p>
        </div>
    </div>
);

const RenderOption = ({ option }) => (
    <div className='gr-6 gr-12-p gr-12-m gr-parent'>
        <div className='box border-gray welcome-content-box'>
            <div className='welcome-content-box-icon-container'>
                {option.icon_list.map((icon) =>
                    <img key={icon} className='welcome-content-box-icon' src={it.url_for(icon)} />
                )}
            </div>
            <p id='upgrade_text' className='welcome-content-title'>{it.L(option.title)}</p>
            <p >{it.L(option.desc)}</p>

            <SeparatorLine className='gr-padding-5' />

            <div className='welcome-content-platform-container'>
                <p id='upgrade_text' className='welcome-content-title'>{it.L('Platforms')}</p>
                {option.platform_list.map((platform) =>
                    <Platform key={platform.title} {...platform} />
                )}
                <div className='welcome-content-action-container'>
                    <a id={option.action_id} className='button-secondary' href='javascript:;'>
                        <span className='welcome-content-action'>{it.L(option.action_title)}</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
);

const WelcomePage = () => (
    <div id='welcome_container' className='center-text welcome-content'>
        <h1>{it.L('Where would you like to start?')}</h1>

        <div className='welcome-content-container'>
            {options.map(option => (<RenderOption key={option.title} option={option} />))}
        </div>

        <SeparatorLine className='gr-padding-10' invisible />
    </div>
);

export default WelcomePage;
