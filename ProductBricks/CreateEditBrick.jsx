import React from 'react'
import Modal from 'react-modal'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import CommError from '../Errors/Errors'

import './CreateEditBrick.css'

const styling = {
    content: {
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100%',
        paddingTop: '0px',
        background: 'white'
    }
}

const CreateEditBrick = (
    {
        errBrick,
        errBrickClear,

        curBrick,
        tmpBrick,

        create,
        isOpen,

        onAfterOpen,
        onRequestClose,
        onRequestCancel,

        maxBrickLength,
        exactBrickLength,

        filter,
        onValuesFilter,
        onValuesEdit,
        onValuesCreate,
        onValuesDelete,
        valuesCheck
    }) => (
    <Modal isOpen={isOpen} onAfterOpen={onAfterOpen} onRequestClose={onRequestClose} style={styling}>
        <CommError error={errBrick.error} onClose={errBrickClear} />

        <div className="create-edit-brick productManagement">
            <h1>{create ? 'Edit' : 'Create'} Brick</h1>
            <p className="sublabel">A Product Brick is the building block for creating a configured Reico SKU, attributes and supplemental product data fields.</p>
            <p className="required">*= Required to Submit</p>
            <div>
                { create ? 
                    <div className="form-group">
                        <label>Brick ID:</label>
                        <span id="brick_id">{create ? curBrick.productBrickId : null}</span>
                    </div> : null
                }
                <div className="form-group">
                    <label htmlFor="brick_name">Name:*</label>
                    <input className="form-control" id="brick_name" defaultValue={create ? curBrick.name : tmpBrick.name} onChange={valuesCheck} />
                </div>
                <div className="form-group">
                    <label htmlFor="brick_source">Source Field:</label>
                    <input className="form-control" id="brick_source" defaultValue={create ? curBrick.sourceField : tmpBrick.sourceField} />
                </div>
                <div className="form-group">
                    <label htmlFor="brick_length">Length:*</label>
                    {
                        create ?
                            <input className="form-control" id="brick_length" defaultValue={curBrick.length} onChange={valuesCheck} />
                        :
                            <input className="form-control" id="brick_length" defaultValue={tmpBrick.length} onChange={valuesCheck} />
                    }

                    <input type="radio" id="max" onClick={maxBrickLength} />
                    <span className="length">Max</span>

                    <input type="radio" id="exact" onClick={exactBrickLength} />
                    <span className="length">Exact</span>
                </div>
                <div className="form-group">
                    <label htmlFor="brick_example">Example Code:</label>
                    <input className="form-control" id="brick_example" defaultValue={create ? curBrick.example : tmpBrick.example} />
                </div>
                <div className="form-group">
                    <label id="values">Values:</label>
                            <input className="form-control" id="values" onChange={onValuesFilter} placeholder="Filter By" />
                            <div className="values form-control">
                                {!create ?
                                    tmpBrick.values.map((value, index) => {
                                        if (filter === '' || value.code.toLowerCase().startsWith(filter) || value.name.toLowerCase().startsWith(filter))
                                            return (
                                                <p className="bricks" key={index}>
                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                                        <i className="fa fa-edit" index={index} onClick={onValuesEdit}></i>
                                                    </OverlayTrigger>
                                                    {value.code} - {value.name}
                                                </p>
                                            ) 
                                        else
                                            return null
                                    })

                                :

                                    tmpBrick.values.length ?
                                        tmpBrick.values.map((value, index) => {
                                            if (filter === '' || value.code.toLowerCase().startsWith(filter) || value.name.toLowerCase().startsWith(filter))
                                                return (
                                                    <p className="bricks" key={index}>
                                                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                                            <i className="fa fa-edit bricks" index={index} onClick={onValuesEdit}></i>
                                                        </OverlayTrigger>
                                                        {value.code} - {value.name}
                                                    </p>
                                                )
                                            else
                                                return null
                                        })

                                    :

                                        curBrick.values.map((value, index) => {
                                            if (filter === '' || value.code.toLowerCase().startsWith(filter) || value.name.toLowerCase().startsWith(filter))
                                                return (
                                                    <p className="bricks" key={index}>
                                                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                                            <i className="fa fa-edit bricks" index={index} onClick={onValuesEdit}></i>
                                                        </OverlayTrigger>
                                                    {value.code} - {value.name}
                                                </p>
                                                ) 
                                            else
                                                return null
                                        })
                                }
                            </div>
                        </div>

                        <div className="form-group">
                            <button className="btn btn-default add" onClick={onValuesCreate}>
                                <i className="fa fa-plus"></i> Add Value
                            </button>
                        </div>
            </div>

            <div className="form-group">
                <a className="btn btn-default" onClick={onRequestCancel} >Cancel</a>&nbsp;
                <button className="btn btn-primary modbrick" create={create ? "false" : "true"} onClick={onRequestClose}>Submit</button>
            </div>
        </div>
    </Modal>
);

Modal.setAppElement('body');
        
export default CreateEditBrick