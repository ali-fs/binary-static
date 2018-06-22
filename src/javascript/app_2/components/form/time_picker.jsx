import React,
    { PureComponent } from 'react';
import PropTypes      from 'prop-types';
import { localize }   from '../../../_common/localize';

/* TODO:
      1. to handle disabled time period
      2. to handle null as initial value
      3. update the state only when dropdown closed
*/

class TimePickerDropdown extends PureComponent {
    constructor(props) {
        super(props);
        this.hours   = [...Array(24).keys()].map((a)=>`0${a}`.slice(-2));
        this.minutes = [...Array(12).keys()].map((a)=>`0${a*5}`.slice(-2));
        this.state   = {
            hour              : props.value.split(':')[0],
            minute            : (props.value.split(':')[1] || '').split(' ')[0],
            is_hour_selected  : false,
            is_minute_selected: false,
            last_updated_type : null,
        };
        this.selectHour    = this.selectOption.bind(this, 'hour');
        this.selectMinute  = this.selectOption.bind(this, 'minute');
        this.saveHourRef   = this.saveRef.bind(this, 'hour');
        this.saveMinuteRef = this.saveRef.bind(this, 'minute');
    }

    componentDidUpdate(prevProps, prevState) {
        const { is_hour_selected, is_minute_selected } = this.state;
        if (is_hour_selected && is_minute_selected) {
            this.resetValues();
            this.props.toggle();
        }

        const { hour, minute } = this.state;
        if (hour && minute && (hour !== prevState.hour || minute !== prevState.minute)) {
            // Call on change only once when all of the values are selected and one of the value is changed
            this.props.onChange(`${hour}:${minute}`);
        }

        if (!prevProps.className && this.props.className === 'active') {
            this.resetValues();
        }
        if (prevState.last_updated_type !== this.state.last_updated_type && this.state.last_updated_type) {
            this.setState({ last_updated_type: null });
        }
    }

    resetValues() {
        this.setState({
            is_hour_selected  : false,
            is_minute_selected: false,
        });
    }

    selectOption(type, value) {
        this.setState({
            last_updated_type: type,
        });
        if (type === 'hour') {
            this.setState({
                hour            : value,
                is_hour_selected: true,
            });
        } else if (type === 'minute') {
            this.setState({
                minute            : value,
                is_minute_selected: true,
            });
        }
    }

    clear = (event) => {
        event.stopPropagation();
        this.resetValues();
        this.setState({
            hour  : undefined,
            minute: undefined,
        });
        this.props.onChange('');
    };

    saveRef(type, node) {
        if (!node) return;
        const save = {
            hour  : (n) => this.hourSelect = n,
            minute: (n) => this.minuteSelect = n,
        };

        save[type](node);
    }

    render() {
        const { preClass, value, toggle } = this.props;
        return (
            <div className={`${preClass}-dropdown ${this.props.className}`}>
                <div
                    className={`${preClass}-panel`}
                    onClick={toggle}
                >
                    <span className={value ? '' : 'placeholder'}>{value || localize('Select time')}</span>
                    <span
                        className={`${preClass}-clear`}
                        onClick={this.clear}
                    />
                </div>
                <div className={`${preClass}-selector`}>
                    <div
                        ref={this.saveHourRef}
                        className={`${preClass}-hours`}
                    >
                        <div className='list-title center-text'><strong>{localize('Hour')}</strong></div>
                        <div className='list-container'>
                            {this.hours.map((h, key) => (
                                <div
                                    className={`list-item${this.state.hour === h ? ' selected' : ''}`}
                                    key={key}
                                    onClick={this.selectHour.bind(null, h)}
                                >
                                    {h}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        ref={this.saveMinuteRef}
                        className={`${preClass}-minutes`}
                    >
                        <div className='list-title center-text'><strong>{localize('Minute')}</strong></div>
                        <div className='list-container'>
                            {this.minutes.map((mm, key) => (
                                <div
                                    className={`list-item${this.state.minute === mm ? ' selected' : ''}`}
                                    key={key}
                                    onClick={this.selectMinute.bind(null, mm)}
                                >{mm}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class TimePicker extends PureComponent {
    constructor (props) {
        super(props);
        this.state = {
            is_open: false,
            value  : '',
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    toggleDropDown = () => {
        this.setState({ is_open: !this.state.is_open });
    };

    handleChange = (arg) => {

        // To handle nativepicker;
        const value = typeof arg === 'object' ? this.convertTo12h(arg.target.value) : arg;

        if (value !== this.props.value) {
            this.props.onChange({ target: { name: this.props.name, value } });
        }
    };

    saveRef = (node) => {
        if (!node) return;
        if (node.nodeName === 'INPUT') {
            this.target_element = node;
            return;
        }
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)) {
            if (this.state.is_open) {
                this.setState({ is_open: false });
            }
        }
    };

    convertTo24h = (value) => {
        if (!value) return '';
        const [hour, minute] = value.split(':');
        return `${hour%12 ? hour : '00'}:${minute}`;
    };

    convertTo12h = (value) => {
        if (!value) return '';
        const [hour, minute] = value.split(':');
        return `${+hour === 0 ? 12 : hour}:${minute}`;
    };

    render() {
        const prefix_class='time-picker';
        const {
            is_nativepicker,
            value,
            name,
            is_align_right,
            placeholder,
        } = this.props;
        const formatted_value = this.convertTo24h(value);
        return (
            <div
                ref={this.saveRef}
                className={`${prefix_class}${this.props.padding ? ' padding' : ''}${this.state.is_open ? ' active' : ''}`}
            >
                {
                    is_nativepicker
                    ? <input
                        type='time'
                        id={`${prefix_class}-input`}
                        value={formatted_value}
                        onChange={this.handleChange}
                        name={name}
                    />
                    : (
                        <React.Fragment>
                            <input
                                ref={this.saveRef}
                                type='text'
                                readOnly
                                id={`${prefix_class}-input`}
                                className={`${prefix_class}-input ${this.state.is_open ? 'active' : ''}`}
                                value={value}
                                onClick={this.toggleDropDown}
                                name={name}
                                placeholder={placeholder}
                            />
                            <TimePickerDropdown
                                className={`${this.state.is_open ? 'active' : ''}${is_align_right ? ' from-right' : '' }`}
                                toggle={this.toggleDropDown}
                                onChange={this.handleChange}
                                preClass={prefix_class}
                                value={value}
                            />
                        </React.Fragment>
                    )
                }
            </div>
        );
    }
}

TimePicker.propTypes = {
    is_nativepicker: PropTypes.bool,
    is_align_right : PropTypes.bool,
    name           : PropTypes.string,
    onChange       : PropTypes.func,
    padding        : PropTypes.string,
    placeholder    : PropTypes.string,
    value          : PropTypes.string,
};

TimePickerDropdown.propTypes = {
    className  : PropTypes.string,
    onChange   : PropTypes.func,
    preClass   : PropTypes.string,
    toggle     : PropTypes.func,
    value      : PropTypes.string,
    value_split: PropTypes.bool,
};

export default TimePicker;
