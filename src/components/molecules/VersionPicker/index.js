import PropTypes from 'prop-types';
import React from 'react';

class VersionPicker extends React.Component {
    static propTypes = {
        versions: PropTypes.arrayOf(PropTypes.string).isRequired,
        currentVersion: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { versions, currentVersion } = this.props;
        return versions.length > 1 ? (<div className="version-picker__wrapper">
            <div className="version-picker">
                <div className="left-column"></div>
                <div className="middle-column">
                    <div className="version-picker__current">{`${
                        currentVersion === versions[versions.length - 1] ? 'You are viewing the latest version of this documentation' : 'There are newer versions of this documentation available'}`
                    }</div>
                </div>
                <div className="right-column">
                    <div className="version-picker-select__wrapper">
                        <select
                            className="version-picker__select"
                            value={currentVersion}
                            onChange={(e) => this.props.onChange(e.target.value)}>
                            {versions.map((version, indx) => (<option key={indx} value={version} >Version {version}</option>))}
                        </select>
                    </div>
                </div>
            </div>
        </div>) : null;
    }
}

export default VersionPicker;
