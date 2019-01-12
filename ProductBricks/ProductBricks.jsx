import React from 'react'
import { connect } from 'react-redux';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import $ from 'jquery'

import CreateEditBrick from './CreateEditBrick'
import CreateEditValues from './CreateEditValues'

import { fetchBrick } from '../../GlobalStateContainer/actions'
import { fetchBrickError } from '../../GlobalStateContainer/actions'
import { createBrick } from '../../GlobalStateContainer/actions'
import { updateBrick } from '../../GlobalStateContainer/actions'
import { updateBrickValues } from '../../GlobalStateContainer/actions'
import { errorBrick } from '../../GlobalStateContainer/actions'

import { fetchBricksList } from '../../GlobalStateContainer/actions'

import CommError from '../Errors/Errors'

import './ProductBricks.css'

var Spinner = require('react-spinkit');

let chkReturn = 0;

class ProductBricks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editBrickMode: false,
            editValuesMode: false,
            brick: {
                name: '',
                length: '0',
                example: '',
                sourceField: '',
                values: []
            },
            exactLength: true,
            value: -1,
            valueFilter: ''
        };

        this.fetchBrickErrorClear = this.fetchBrickErrorClear.bind(this);
        this.errorBrickClear = this.errorBrickClear.bind(this);

        this.brickEdit = this.brickEdit.bind(this);
        this.brickEditVerify = this.brickEditVerify.bind(this);
        this.brickCreate = this.brickCreate.bind(this);
        this.updateBrick = this.updateBrick.bind(this);
        this.cancelBrick = this.cancelBrick.bind(this);
        this.closeBrick = this.closeBrick.bind(this);

        this.maxLen = this.maxLen.bind(this);
        this.exactLen = this.exactLen.bind(this);

        this.valuesFilter = this.valuesFilter.bind(this);
        this.valuesEdit = this.valuesEdit.bind(this);
        this.valuesCreate = this.valuesCreate.bind(this);
        this.valuesDelete = this.valuesDelete.bind(this);
        this.valuesCheck = this.valuesCheck.bind(this);
        this.afterOpen = this.afterOpen.bind(this);
        this.afterOpenValues = this.afterOpenValues.bind(this);
        this.updateValues = this.updateValues.bind(this);
        this.closeValues = this.closeValues.bind(this);
    }

    afterOpen() {
        this.brickCheck()

        if (!this.state.editBrick) {
            $('input#max').prop('checked', true)
            $('input#exact').prop('checked', false)

            this.setState({ exactLength: false })
        }
        else {
            $('input#max').prop('checked', false)
            $('input#exact').prop('checked', true)

            this.setState({ exactLength: true })

            this.props.brick.brick.values.forEach((val) => {
                if (val.code.length != this.props.brick.brick.length) {
                    $('input#max').prop('checked', true)
                    $('input#exact').prop('checked', false)

                    this.setState({ exactLength: false })
                }
            })
        }

    }
    brickCheck() {
        if ($('#brick_name').val().length === 0 || $('#brick_length').val().length === 0)
            $('button.modbrick').attr("disabled", "disabled")
        else
            $('button.modbrick').removeAttr("disabled")
    }

    fetchBrickErrorClear() {
        this.props.dispatch(fetchBrickError);
    }

    errorBrickClear(e) {
        this.props.dispatch(errorBrick);

        if (this.props.brick.error === "409") {
            let id = e.target.attributes.brick.value;

            fetchBrick.bind(this)(id);
        }
    }

    brickEdit(e) {

        if (chkReturn) return;
        chkReturn = 1;

        let id = e.target.attributes.brick.value;

        this.setState({
            brick: {
                name: '',
                length: '0',
                example: '',
                sourceField: '',
                values: []
            }
        });

        fetchBrick.bind(this)(id);

        chkReturn = setInterval(this.brickEditVerify, 100);
    }
    brickEditVerify() {
        if (this.props.brick.updated || this.props.brick.error) {
            if (this.props.brick.updated) {
                this.setState({
                    value: -1,
                    editBrick: true,
                    editBrickMode: true
                });

                $('.navbar-static-top').css('z-index', 0);
            }

            clearInterval(chkReturn);
            chkReturn = 0;
        }
    }
    brickCreate() {
        let emptybrk = {
            name: '',
            length: '0',
            example: '',
            sourceField: '',
            values: []
        };

        this.setState({
            brick: emptybrk,
            exactLength: true,
            value: -1,
            editBrick: false,
            editBrickMode: true
        });

        updateBrickValues.bind(this)(emptybrk);

        $('.navbar-static-top').css('z-index', 0);
    }
    updateBrick(e) {
        $('button.modbrick').attr('disabled','disabled')

        let create = e.target.attributes.create.value;
        let brick = {
            name: $('#brick_name').val().trim(),
            length: $('#brick_length').val(),
            example: $('#brick_example').val(),
            sourceField: $('#brick_source').val(),
            values: []
        };

        $('p.bricks').each(function (index, value) {
            let comp = $(value).text().split(' - ')

            brick.values.push({
                code: comp[0],
                name: comp[1],
                language: "en"
            })
        })

        if (create === 'true') {
            createBrick.bind(this)(brick);
        }
        else {
            brick.productBrickId = parseInt($('#brick_id').text());
            updateBrick.bind(this)(brick.productBrickId, brick);
        }

        chkReturn = setInterval(this.closeBrick, 100);
    }
    cancelBrick() {
        this.props.dispatch(errorBrick);

        this.setState({
            editBrickMode: false
        });

        $('.navbar-static-top').css('z-index', 1000);
    }
    closeBrick() {
        if (this.props.brick.updated || this.props.brick.error) {
            $('button.modbrick').removeAttr('disabled')

            if (this.props.brick.updated) {
                this.cancelBrick();

                this.props.dispatch(fetchBricksList);
            }

            clearInterval(chkReturn);
            chkReturn = 0;
        }
    }

    maxLen() {
        this.setState({ exactLength: false })
        $('input#exact').prop('checked', false)
     }
    exactLen() {
        this.setState({ exactLength: true })
        $('input#max').prop('checked', false)
     }

    valuesFilter(e) {
        let filter = e.target.value.toLowerCase();

        this.setState({
            valueFilter: filter
        });
    }
    valuesEdit(e) {
        let value = parseInt(e.target.attributes.index.value);

        this.setState({
            value: value,
            editValues: true,
            editValuesMode: true
        });
    }
    valuesCreate() {
        let brick = this.state.brick

        brick.length = $('#brick_length').val()

        this.setState({
            value: -1,
            editValues: false,
            editValuesMode: true,

            brick: brick
        });
    }
    valuesDelete(e) {
        let brick = Object.assign({}, this.props.brick.brick);
        let value = parseInt(e.target.attributes.index.value);

        brick.values.splice(value, 1);
        updateBrickValues.bind(this)(brick);
    }
    afterOpenValues() {
        this.valuesCheck()
    }
    updateValues() {
        let name = $('input.name').val();
        let code = $('input.code').val().toLowerCase();
        let brick = Object.assign({}, this.props.brick.brick);

        if (this.state.value === -1) {
            brick.values.push({
                name: name,
                code: code,
                language: "en"
            })
        }
        else {
            brick.values[this.state.value].name = name;
            brick.values[this.state.value].code = code;
        }

        this.setState({ brick: brick });

        updateBrickValues.bind(this)(brick);

        this.setState({
            editValuesMode: false
        });
    }
    closeValues() {
        this.setState({
            editValuesMode: false
        });
    }

    valuesCheck() {
        let name_len = $('input.name').val().length
        let code_len = $('input.code').val().length
        let brick_len = parseInt($('#brick_length').val())

        if ( name_len === 0 || code_len === 0 ||
            (code_len !== brick_len && this.state.exactLength) ||
            (code_len > brick_len && !this.state.exactLength))
            $('#save').attr("disabled", "disabled")
        else 
            $('#save').removeAttr("disabled")
        
    }

    render() {
        return (
            <div className="product-bricks col-xs-12">
                <CommError error={this.props.brick.error} onClose={this.errorBrickClear} />
                <CommError error={this.props.bricks.error} onClose={this.fetchBrickErrorClear} />

                <div className="headWrapper">
                    <div className="productBricks ">
                        <h1>Product Bricks</h1>
                    </div>
                    <div className="button">
                        <button 
                            onClick={this.brickCreate}
                            className="btn btn-primary pull-right"
                        >
                            + Create Brick
                        </button>
                    </div>
                </div>
                <div className="tableWrapper"> 
                    {
                        this.props.bricks.fetching ?
                            <Spinner name='line-spin-fade-loader' />
                        :
                            null
                    }
                    <table className="lists table table-striped">
                        <thead>
                            <tr className="head">
                                <th>Brick Name</th>
                                <th>Last Edited</th>
                                <th>Source</th>
                                <th>Example</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.bricksList ? this.props.bricksList.map((brick, index) => {
                                    return <tr className="body" key={index}>
                                        <td className="name" brick={brick.productBrickId} onClick={this.brickEdit}>{brick.name}</td>
                                        <td>{brick.lastUpdatedAtDisplay}</td>
                                        <td>{brick.sourceField}</td>
                                        <td>{brick.example}</td>
                                        <td>
                                            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                                <i className="fa fa-edit" brick={brick.productBrickId} onClick={this.brickEdit}></i>
                                            </OverlayTrigger>
                                        </td>
                                    </tr>
                                }) : null
                            }
                        </tbody>
                    </table>
                </div>

                <CreateEditBrick
                    errBrick={this.props.brick}
                    errBrickClear={this.errorBrickClear}

                    curBrick={this.props.brick.brick}
                    tmpBrick={this.state.brick}

                    create={this.state.editBrick}
                    isOpen={this.state.editBrickMode}

                    onAfterOpen={this.afterOpen}
                    onRequestClose={this.updateBrick}
                    onRequestCancel={this.cancelBrick}

                    maxBrickLength={this.maxLen}
                    exactBrickLength={this.exactLen}

                    filter={this.state.valueFilter}
                    onValuesFilter={this.valuesFilter}
                    onValuesEdit={this.valuesEdit}
                    onValuesCreate={this.valuesCreate}
                    onValuesDelete={this.valuesDelete}
                    valuesCheck={this.brickCheck}
                />
                <CreateEditValues
                    curValue={this.state.value}

                    curBrick={this.state.editValues ? this.props.brick.brick : this.state.brick}

                    exactLength={this.state.exactLength}

                    create={this.state.editValues}
                    isOpen={this.state.editValuesMode}

                    brickCreate={this.state.editBrick}

                    onAfterOpen={this.afterOpenValues}
                    onRequestClose={this.updateValues}
                    onRequestCancel={this.closeValues}

                    valuesCheck={this.valuesCheck}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    brick: state.brick,
    bricks: state.bricks
});

export default connect(mapStateToProps)(ProductBricks)