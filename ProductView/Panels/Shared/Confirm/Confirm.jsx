import React from 'react'
import ConfirmModal from './ConfirmModal';

class Confirm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.confirm) {
            return <ConfirmModal msg={this.props.msg} onNo={this.props.onNo} onYes={this.props.onYes} />
        }
        else return null
    }
}

export default Confirm
