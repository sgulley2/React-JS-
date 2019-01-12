import React from 'react';
import {
    Modal as BootstrapModal,
    Button as BootstrapButton
} from 'react-bootstrap';

const styling = {
    color: '#fff',
    backgroundColor: "#a94442" // Taken from current bootstrap theme - update as needed
}

const ConfirmModal = ({
    msg,
    onNo,
    onYes
}) => (
        <BootstrapModal show={true} onHide={onNo}>

            <BootstrapModal.Body className="text-info">{msg}</BootstrapModal.Body>

            <BootstrapModal.Footer>
                <BootstrapButton onClick={onNo}>Cancel</BootstrapButton>
                <BootstrapButton bsStyle="primary" onClick={onYes}>Yes</BootstrapButton>
            </BootstrapModal.Footer>
        </BootstrapModal>
    );

export default ConfirmModal;