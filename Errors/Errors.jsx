import React from 'react'
import BootstrapErrorModal from '../../../SharedComponents/UserMessaging/BootstrapErrorModal';

let commErrors = {
    "400": "Expression invalid please update and retry",
    "401": "User is no longer authorized please log back in",
    "404": "Record not found, please select another record or contact support team",
    "409": "Record changed, Hit OK to refresh",
    "500": "An error has occurred on the server, Please contact the support team so it can be investigated",
    "API TOKEN FAILURE": "User is no longer authorized please log back in"
}

class CommError extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.error && this.props.error !== 'SQL_FAILURE') {
            if (this.props.error.response) {
                if (this.props.error.response.status == "400" && this.props.error.response.data && this.props.error.response.data.message)
                    commErrors["400"] = this.props.error.response.data.message

                return <BootstrapErrorModal
                           show={true}
                           title={commErrors.hasOwnProperty(this.props.error.response.status) ? this.props.error.response.status + ' - Error' : 'Unknown Error'}
                           body={commErrors[commErrors.hasOwnProperty(this.props.error.response.status) ? this.props.error.response.status : "500"]}
                           onClose={this.props.onClose}
                       />
            }
            else return <BootstrapErrorModal show={true} title={'Unknown Error'} body={commErrors["500"]} onClose={this.props.onClose} />
        }
        else return null
    }
}

export default CommError
