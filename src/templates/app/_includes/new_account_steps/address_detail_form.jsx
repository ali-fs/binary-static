import React from 'react';
import {
    AddressLine1,
    AddressLine2,
    AddressCity,
    AddressState,
    AddressPostcode,
} from '../../../_common/components/forms_common_rows.jsx';

const AddressDetailForm = () => (
    <form id='address_detail_step_form' className='gr-padding-10'>
        <div className='gr-8 auto-margin' id='address_section' >
            <div className='gr-padding-20'>
                <p className='hint'><strong>{it.L('Only use an address for which you have proof of residence - ')}</strong></p>
                <p className='hint'>{it.L('Only use an address for which you have proof of residence - a recent utility bill (e.g. electricity, water, gas, landline, or internet), bank statement, or government-issued letter with your name and this address.')}</p>
            </div>

            <AddressLine1 row_id='address_line_1_row' row_class='invisible' />
            <AddressLine2 row_id='address_line_2_row' row_class='invisible' />
            <AddressCity row_id='address_city_row' row_class='invisible' />
            <AddressState row_id='address_state_row' row_class='invisible' />
            <AddressPostcode row_id='address_postcode_row' row_class=' invisible' />
        </div>
        <div className='align-end' id='submit_section'>
            <a className='button button-secondary btn_cancel action_previous' href='javascript:;'><span>{it.L('Previous')}</span></a>
            <button className='button' type='submit'>{it.L('Next')}</button>
        </div>
    </form>
);

export default AddressDetailForm;
