import React from 'react';
import { Fieldset } from '../../_common/components/forms.jsx';

const PepDeclaration = () => (
    <Fieldset legend={it.L('Real accounts are not available to politically exposed persons (PEPs).')} className='fieldset_margin_top'>
        <div className='gr-12'>
            <label>{it.L('A politically exposed person (PEP) is someone appointed with a prominent public position. Close associates and family members of a PEP are also considered to be PEPs.')}&nbsp;
                <a id='pep_declaration_note_toggle' className='toggle-arrow' href='javascript:;'>{it.L('Learn more')}</a>
            </label>
            <div id='pep_declaration_note' style={{ display: 'none' }}>
                <p>{it.L('A politically exposed person (PEP) is someone appointed with a prominent public position. Close associates and family members of a PEP are also considered to be PEPs.')}</p>
            </div>
        </div>
        <div className='gr-padding-10 gr-12'>
            <input id='not_pep' type='checkbox' />
            <label htmlFor='not_pep'>
                {it.L('I am not a PEP, and I have not been a PEP in the last 12 months.')}
            </label>
        </div>
    </Fieldset>
);

export default PepDeclaration;
