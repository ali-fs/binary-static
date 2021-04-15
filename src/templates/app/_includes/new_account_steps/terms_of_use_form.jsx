import React from 'react';
import PepDeclaration from '../pep_declaration.jsx';
import {
    Jurisdiction,
    RiskDisclaimer,
    Tnc,
} from '../../../_common/components/forms_common_rows.jsx';

const TermsOfUseForm = () => (
    <React.Fragment>
        <form id='terms_of_use_step_form' className='gr-padding-10'>
            <div id='terms_of_use_section' className='gr-12 auto-margin'>
                <Jurisdiction row_id='jurisdiction_row' className='invisible' />
                <RiskDisclaimer row_id='risk_disclaimer_row' className='invisible' />
                <PepDeclaration row_id='pep_declaration_row' className='invisible' />
                <Tnc row_id='tnc_row' className='invisible' />
            </div>
            <div className='align-end' id='submit_section'>
                <a className='button button-secondary btn_cancel action_previous' href='javascript:;'><span>{it.L('Previous')}</span></a>
                <button id='new_account_submit' className='button' type='submit' action='new_account'>{it.L('Add account')}</button>
            </div>
        </form >
    </React.Fragment>
);

export default TermsOfUseForm;
