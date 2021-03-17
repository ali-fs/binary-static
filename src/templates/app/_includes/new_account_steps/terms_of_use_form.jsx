import React from 'react';
import PepDeclaration from '../pep_declaration.jsx';
import ProfessionalClient from '../professional_client.jsx';
import {
    Jurisdiction,
    RiskDisclaimer,
    Tnc,
} from '../../../_common/components/forms_common_rows.jsx';

const TermsOfUseForm = () => (
    <React.Fragment>
        <form id='terms_of_use_step_form' className='gr-padding-10'>
            <Jurisdiction />
            <RiskDisclaimer />
            <PepDeclaration />
            <Tnc />
            <ProfessionalClient />
            <fieldset>
                <div className='gr-12'>
                    <p>{it.L('<strong>Appropriateness Test: WARNING:</strong> In providing our services to you, we are required to obtain information from you in order to assess whether a given product or service is appropriate for you (that is, whether you possess the experience and knowledge to understand the risks involved).')}</p>
                    <p>{it.L('On the basis of the information provided in relation to your knowledge and experience, we consider that the investments available via this website are not appropriate for you.')}</p>
                    <p>{it.L('By clicking <strong>Accept</strong> below and proceeding with the Account Opening you should note that you may be exposing yourself to risks (which may be significant, including the risk of loss of the entire sum invested) that you may not have the knowledge and experience to properly assess or mitigate.')}</p>
                    <p className='center-text'>
                        <button className='button' type='submit'>{it.L('Accept')}</button>
                        <a id='financial_risk_decline' className='button' href={it.url_for('trading')}><span>{it.L('Decline')}</span></a>
                    </p>
                </div>
            </fieldset>
            <div className='align-end' id='submit_section'>
                <a className='button button-secondary btn_cancel action_previous' href='javascript:;'><span>{it.L('Previous')}</span></a>
                <button className='button' type='submit'>{it.L('Create account')}</button>
            </div>
        </form >
    </React.Fragment>
);

export default TermsOfUseForm;
