import React from 'react'
import Modal from 'react-modal'

import './CreateEditValues.css'

const styling = {
    content: {
        top: '150px',
        left: '430px',
        width: '28%',
        height: '35%',
        background: 'white',
        paddingBottom: '0px'
    }
}

const CreateEditValues = ({ curValue, curBrick, exactLength, create, isOpen, brickCreate, onAfterOpen, onRequestClose, onRequestCancel, valuesCheck }) => (
    <Modal isOpen={isOpen} onAfterOpen={onAfterOpen} onRequestClose={onRequestClose} style={styling}>
        <div className="valuesmain productManagement">
            <h1>{create ? 'Edit' : 'Create'} Values</h1>

            <table className="values">
                <tbody>
                    <tr>
                        <td className="values"><span>Name:*</span></td>
                        {
                            curValue === -1 ?
                                <td className="values"><input className="name" onChange={valuesCheck} /></td>
                            :
                                <td className="values"><input className="name" defaultValue={curBrick.values[curValue].name} onChange={valuesCheck} /></td>
                        }
                    </tr>
                    <tr>
                        <td className="values"><span>Code:*</span></td>
                        {
                            curValue === -1 ?
                                <td className="values">
                                    <input className="code" onChange={valuesCheck} />
                                    {
                                        exactLength ?
                                            <p className="codelen">* Code length must equal {curBrick.length}</p>
                                        :
                                            <p className="codelen">* Code length must be less than or equal to {curBrick.length}</p>
                                    }
                                </td>
                            :
                                <td className="values">
                                    <input className="code" disabled={brickCreate ? "disabled" : ""} defaultValue={curBrick.values[curValue].code} onChange={valuesCheck} />
                                    {
                                        exactLength ?
                                            <p className="codelen">* Code length must equal {curBrick.length}</p>
                                        :
                                            <p className="codelen">* Code length must be less than or equal to {curBrick.length}</p>
                                    }
                                </td>
                        }
                    </tr>
                </tbody>
            </table>

            <div className="valuesbuttons form-group">
                <button className="btn btn-default" id="close" onClick={onRequestCancel}>Close</button>&nbsp;
                <button className="btn btn-primary" id="save" onClick={onRequestClose}>Save Changes</button>
            </div>
        </div>
    </Modal>
);

Modal.setAppElement('body');

export default CreateEditValues