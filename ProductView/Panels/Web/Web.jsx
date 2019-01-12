import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

import Confirm from '../Shared/Confirm/Confirm';

import { saveProductOverrides } from '../../../../GlobalStateContainer/actions'

import './Web.css'

class WebPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            confirmSaveOverrides: false,
            confirmClearOverrides: false
        }

        this.checkName = this.checkName.bind(this)
        this.checkDates = this.checkDates.bind(this)
        this.checkIntegers = this.checkIntegers.bind(this)
        this.checkDecimals = this.checkDecimals.bind(this)
 
        this.saveOverrides = this.saveOverrides.bind(this)
        this.clearOverrides = this.clearOverrides.bind(this)

        this.confirmSaveOverrides = this.confirmSaveOverrides.bind(this)
        this.closeConfirmSaveOverrides = this.closeConfirmSaveOverrides.bind(this)

        this.confirmClearOverrides = this.confirmClearOverrides.bind(this)
        this.closeConfirmClearOverrides = this.closeConfirmClearOverrides.bind(this)
    }

    componentDidMount() {
        $('div.webPanel textarea').each(function () {
            if (!$(this).attr('readOnly'))
                $($(this).prev().children()[0]).prop('checked', true)
        })

        $('div.webPanel select').each(function () {
            if (!$(this).attr('disabled'))
                $($(this).prev().children()[0]).prop('checked', true)
        })

        $('div.webPanel input.input-options').each(function () {
            if (!$(this).attr('readOnly'))
                $($(this).prev().children()[0]).prop('checked', true)
        })
    }

    enableDisable(e) {
        e.target.parentNode.parentNode.children[1].readOnly = !e.target.checked

        if (!e.target.checked) {
            e.target.parentNode.parentNode.children[1].value = e.target.parentNode.parentNode.children[1].attributes.origvalue.value
        }
    }
    enableDisable2(e) {
        e.target.parentNode.parentNode.children[1].disabled = !e.target.checked

        if (!e.target.checked) {
            e.target.parentNode.parentNode.children[1].value = e.target.parentNode.parentNode.children[1].attributes.origvalue.value
        }
    }

    checkName(e) {
        let err_id = 'p#' + e.target.name + '_error'

        if (e.target.value.length) {
            $(err_id).css('display', 'none')
            this.setState({ name_error: false })
        }
        else {
            $(err_id).css('display', 'block')
            this.setState({ name_error: true })
        }
    }

    checkDates(e) {
        let err_id = 'p#' + e.target.name + '_error'

        $(err_id).css('display', 'block')
        this.setState({ [e.target.name + '_error']: true })

        if (e.target.value.length) {
            if (e.target.value.split('/').length == 3 && new Date(e.target.value) != 'Invalid Date') {
                $(err_id).css('display', 'none')
                this.setState({ [e.target.name + '_error']: false })
            }
        }
    }

    checkIntegers(e) {
        let err_id = 'p#' + e.target.name + '_error'

        $(err_id).css('display', 'none')
        this.setState({ [e.target.name + '_error']: false })

        if (e.target.value.length) {
            for (let i = 0; i < e.target.value.length; i++) {
                if (!['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.target.value[i])) {
                    $(err_id).css('display', 'block')
                    this.setState({ [e.target.name + '_error']: true })

                    break
                }
            }
        }
        else {
            $(err_id).css('display', 'block')
            this.setState({ [e.target.name + '_error']: true })
        }
    }

    checkDecimals(e) {
        let err_id = 'p#' + e.target.name + '_error'

        $(err_id).css('display', 'none')
        this.setState({ [e.target.name + '_error']: false })

        if (e.target.value.length) {
            if (!e.target.value.includes('.')) {
                $(err_id).css('display', 'block')
                this.setState({ [e.target.name + '_error']: true })
            }
            else
                for (let i = 0; i < e.target.value.length; i++) {
                    if (!['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(e.target.value[i])) {
                        $(err_id).css('display', 'block')
                        this.setState({ [e.target.name + '_error']: true })

                        break
                    }
                }
        }
    }

    saveOverrides() {
        this.setState({ confirmSaveOverrides: true })
    }

    clearOverrides() {
        this.setState({ confirmClearOverrides: true })
    }

    confirmSaveOverrides() {
        let overrides = {}

        $('input[type="checkbox"]').each(function () {
            if ($(this).prop('checked')) {
                overrides[$($(this).parent().parent().children()[1]).attr('name')] = $($(this).parent().parent().children()[1]).val()
            }
        })

        this.closeConfirmSaveOverrides()

        saveProductOverrides.bind(this)(this.props.product.product.productMasterId, overrides)
    }

    closeConfirmSaveOverrides() {this.setState({ confirmSaveOverrides: false } )}

    confirmClearOverrides() {
        this.closeConfirmClearOverrides()

        $('input[type="checkbox"]').each(function () {
            $(this).prop('checked', false)
        })

        $('div.webPanel textarea').each(function () {
            $(this).attr('readOnly', 'readOnly')
        })

        $('div.webPanel select').each(function () {
            $(this).attr('disabled', 'disabled')
        })

        $('div.webPanel input.input-options').each(function () {
            $(this).attr('readOnly', 'readOnly')
        })
    }

    closeConfirmClearOverrides() {this.setState({ confirmClearOverrides: false })}

    render() {
        return (
            <div className="webPanel">
                <div className="mainWeb">
                    <p className="heading">
                        This page allows users to update information at the variant level by selecting the checkbox next to the field you want to change then updating or replacing the existing data already there.  Original data is sourced from the template covering this specific product variant. If there are existing check marks this indicates that there are existing overrides, which can be updated or removed.
                    </p>

                    <Confirm
                        confirm={this.state.confirmSaveOverrides}
                        msg="Are you sure you want to submit these changes?"
                        onNo={this.closeConfirmSaveOverrides}
                        onYes={this.confirmSaveOverrides}
                    />
                    <Confirm
                        confirm={this.state.confirmClearOverrides}
                        msg="Are you sure you want to remove all overrides?"
                        onNo={this.closeConfirmClearOverrides}
                        onYes={this.confirmClearOverrides}
                    />

                    <form className="form-horizontal">
                        <div className="form-group">
                            <label className="col-md-2 control-label">Name (txt):*<p id="name_error" className="callout">Required field</p></label>
                            <div className="col-md-10">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.name != undefined ?
                                            <textarea className="form-control" name="name" defaultValue={this.props.overrides.name} origvalue={this.props.product.product.name} onBlur={this.checkName} />
                                        :
                                            <textarea className="form-control" name="name" readOnly defaultValue={this.props.product.product.name} origvalue={this.props.product.product.name} onBlur={this.checkName} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">Description (txt):</label>
                            <div className="col-md-10">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.description != undefined ?
                                            <textarea className="form-control" name="description" defaultValue={this.props.overrides.description} origvalue={this.props.product.product.description} />
                                        :
                                            <textarea className="form-control" readOnly name="description" defaultValue={this.props.product.product.description} origvalue={this.props.product.product.description} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">Manufacturer Part Number (txt):</label>
                            <div className="col-md-10">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.manufacturerPartNumber != undefined ?
                                            <textarea className="form-control" name="manufacturerPartNumber" defaultValue={this.props.overrides.manufacturerPartNumber} origvalue={this.props.product.product.manufacturerPartNumber} />
                                        :
                                            <textarea className="form-control" name="manufacturerPartNumber" readOnly defaultValue={this.props.product.product.manufacturerPartNumber} origvalue={this.props.product.product.manufacturerPartNumber} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">GTIN (txt):</label>
                            <div className="col-md-10">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.gtin != undefined ?
                                            <textarea className="form-control" name="gtin" defaultValue={this.props.overrides.gtin} origvalue={this.props.product.product.gtin} />
                                        :
                                            <textarea className="form-control" name="gtin" readOnly defaultValue={this.props.product.product.gtin} origvalue={this.props.product.product.gtin} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">Image Override (txt):</label>
                            <div className="col-md-10">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.imageOverride != undefined ?
                                            <textarea className="form-control" name="imageOverride" defaultValue={this.props.overrides.imageOverride} origvalue={this.props.product.product.imageOverride} />
                                        :
                                            <textarea className="form-control" name="imageOverride" readOnly defaultValue={this.props.product.product.imageOverride} origvalue={this.props.product.product.imageOverride} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">Override Image Base Name (txt):</label>
                            <div className="col-md-10">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.overrideImageBaseName != undefined ?
                                            <textarea className="form-control" name="overrideImageBaseName" defaultValue={this.props.overrides.overrideImageBaseName} origvalue={this.props.product.product.overrideImageBaseName} />
                                        :
                                            <textarea className="form-control" name="overrideImageBaseName" readOnly defaultValue={this.props.product.product.overrideImageBaseName} origvalue={this.props.product.product.overrideImageBaseName} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">Swatch Image Name (txt):</label>
                            <div className="col-md-10">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.swatchImageName != undefined ?
                                            <textarea className="form-control" name="swatchImageName" defaultValue={this.props.overrides.swatchImageName} origvalue={this.props.product.product.swatchImageName} />
                                        :
                                            <textarea className="form-control" name="swatchImageName" readOnly defaultValue={this.props.product.product.swatchImageName} origvalue={this.props.product.product.swatchImageName} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">Color Swatch (txt):</label>
                            <div className="col-md-10">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.colorSwatch != undefined ?
                                            <textarea className="form-control" name="colorSwatch" defaultValue={this.props.overrides.colorSwatch} origvalue={this.props.product.product.colorSwatch} />
                                        :
                                            <textarea className="form-control" name="colorSwatch" readOnly defaultValue={this.props.product.product.colorSwatch} origvalue={this.props.product.product.colorSwatch} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">Trait 1 Name (txt):</label>
                            <div className="col-md-10">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.trait1Name != undefined ?
                                            <textarea className="form-control" name="trait1Name" defaultValue={this.props.overrides.trait1Name} origvalue={this.props.product.product.trait1Name} />
                                        :
                                            <textarea className="form-control" name="trait1Name" readOnly defaultValue={this.props.product.product.trait1Name} origvalue={this.props.product.product.trait1Name} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">Trait 1 Value (txt):</label>
                            <div className="col-md-10">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.trait1Value != undefined ?
                                            <textarea className="form-control" name="trait1Value" defaultValue={this.props.overrides.trait1Value} origvalue={this.props.product.product.trait1Value} />
                                        :
                                            <textarea className="form-control" name="trait1Value" readOnly defaultValue={this.props.product.product.trait1Value} origvalue={this.props.product.product.trait1Value} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">Trait 2 Name (txt):</label>
                            <div className="col-md-10">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.trait2Name != undefined ?
                                            <textarea className="form-control" name="trait2Name" defaultValue={this.props.overrides.trait2Name} origvalue={this.props.product.product.trait2Name} />
                                        :
                                            <textarea className="form-control" name="trait2Name" readOnly defaultValue={this.props.product.product.trait2Name} origvalue={this.props.product.product.trait2Name} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">Trait 2 Value (txt):</label>
                            <div className="col-md-10">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.trait2Value != undefined ?
                                            <textarea className="form-control" name="trait2Value" defaultValue={this.props.overrides.trait2Value} origvalue={this.props.product.product.trait2Value} />
                                        :
                                            <textarea className="form-control" name="trait2Value" readOnly defaultValue={this.props.product.product.trait2Value} origvalue={this.props.product.product.trait2Value} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">Active (bln):*</label>
                            <div className="col-md-4">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable2} />
                                    </div>
                                    {
                                        this.props.overrides.active != undefined ?
                                            <select name="active" className="dropdown form-control" defaultValue={this.props.overrides.active} origvalue={this.props.product.product.active} >
                                                <option>true</option>
                                                <option>false</option>
                                            </select>
                                        :
                                            <select name="active" disabled className="dropdown form-control" defaultValue={this.props.product.active} origvalue={this.props.product.product.active} >
                                                <option>true</option>
                                                <option>false</option>
                                            </select>
                                    }
                                </div>
                            </div>
                            <label className="col-md-2 control-label">Show Quote Button (bln):*</label>
                            <div className="col-md-4">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable2} />
                                    </div>
                                    {
                                        this.props.overrides.showQuoteButton != undefined ?
                                            <select name="showQuoteButton" className="dropdown form-control" defaultValue={this.props.overrides.showQuoteButton} origvalue={this.props.product.product.showQuoteButton} >
                                                <option>true</option>
                                                <option>false</option>
                                            </select>
                                        :
                                            <select name="showQuoteButton" disabled className="dropdown form-control" defaultValue={this.props.product.showQuoteButton} origvalue={this.props.product.product.showQuoteButton} >
                                                <option>true</option>
                                                <option>false</option>
                                            </select>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">Hide Price Until Cart (bln):*</label>
                            <div className="col-md-4">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable2} />
                                    </div>
                                    {
                                        this.props.overrides.hidePriceUntilCart != undefined ?
                                            <select name="hidePriceUntilCart" className="dropdown form-control" defaultValue={this.props.overrides.hidePriceUntilCart} origvalue={this.props.product.product.hidePriceUntilCart} >
                                                <option>true</option>
                                                <option>false</option>
                                            </select>
                                        :
                                            <select name="hidePriceUntilCart" disabled className="dropdown form-control" defaultValue={this.props.product.hidePriceUntilCart} origvalue={this.props.product.product.hidePriceUntilCart} >
                                                <option>true</option>
                                                <option>false</option>
                                            </select>
                                    }
                                </div>
                            </div>
                            <label className="col-md-2 control-label">Show Buy Button (bln):*</label>
                            <div className="col-md-4">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable2} />
                                    </div>
                                    {
                                        this.props.overrides.showBuyButton != undefined ?
                                            <select name="showBuyButton" className="dropdown form-control" defaultValue={this.props.overrides.showBuyButton} origvalue={this.props.product.product.showBuyButton} >
                                                <option>true</option>
                                                <option>false</option>
                                            </select>
                                        :
                                            <select name="showBuyButton" disabled className="dropdown form-control" defaultValue={this.props.product.showBuyButton} origvalue={this.props.product.product.showBuyButton} >
                                                <option>true</option>
                                                <option>false</option>
                                            </select>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">Start (dte):*<p id="startDate_error" className="callout">Enter in date format</p></label>
                            <div className="col-md-4">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.startDate != undefined ?
                                            <input name="startDate" className="form-control input-options" defaultValue={this.props.overrides.startDate} onBlur={this.checkDates} origvalue={this.props.product.product.startDate} />
                                        :
                                            <input name="startDate" className="form-control input-options" readOnly defaultValue={this.props.product.product.startDate} onBlur={this.checkDates} origvalue={this.props.product.product.startDate} />
                                    }
                                </div>
                            </div>
                            <label className="col-md-2 control-label">End (dte):*<p id="endDate_error" className="callout">Enter in date format</p></label>
                            <div className="col-md-4">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.endDate != undefined ?
                                            <input name="endDate" className="form-control input-options" defaultValue={this.props.overrides.endDate} onBlur={this.checkDates} origvalue={this.props.product.product.endDate} />
                                        :
                                            <input name="endDate" className="form-control input-options" readOnly defaultValue={this.props.product.product.endDate} onBlur={this.checkDates} origvalue={this.props.product.product.endDate} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">Min Quantity (int):*<p id="minimumQty_error" className="callout">Entered value must be an integer</p></label>
                            <div className="col-md-4">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.minimumQty != undefined ?
                                            <input name="minimumQty" className="form-control input-options" defaultValue={this.props.overrides.minimumQty} onBlur={this.checkIntegers} origvalue={this.props.product.product.minimumQty} />
                                        :
                                            <input name="minimumQty" className="form-control input-options" readOnly defaultValue={this.props.product.product.minimumQty} onBlur={this.checkIntegers} origvalue={this.props.product.product.minimumQty} />
                                    }
                                </div>
                            </div>
                            <label className="col-md-2 control-label">Max Quantity (int):*<p id="maximumQty_error" className="callout">Entered value must be an integer</p></label>
                            <div className="col-md-4">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.maximumQty != undefined ?
                                            <input name="maximumQty" className="form-control input-options" defaultValue={this.props.overrides.maximumQty} onBlur={this.checkIntegers} origvalue={this.props.product.product.maximumQty} />
                                        :
                                            <input name="maximumQty" className="form-control input-options" readOnly defaultValue={this.props.product.product.maximumQty} onBlur={this.checkIntegers} origvalue={this.props.product.product.maximumQty} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">Stock Quantity (int):*<p id="inStockQuantity_error" className="callout">Entered value must be an integer</p></label>
                            <div className="col-md-4">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.inStockQuantity != undefined ?
                                            <input name="inStockQuantity" className="form-control input-options" defaultValue={this.props.overrides.inStockQuantity} onBlur={this.checkIntegers} origvalue={this.props.product.product.inStockQuantity} />
                                        :
                                            <input name="inStockQuantity" className="form-control input-options" readOnly defaultValue={this.props.product.product.inStockQuantity} onBlur={this.checkIntegers} origvalue={this.props.product.product.inStockQuantity} />
                                    }
                                </div>
                            </div>
                            <label className="col-md-2 control-label">Weight (dec):<p id="weight_error" className="callout">Entered value must be a decimal number</p></label>
                            <div className="col-md-4">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.weight != undefined ?
                                            <input name="weight" className="form-control input-options" defaultValue={this.props.overrides.weight} onBlur={this.checkDecimals} origvalue={this.props.product.product.weight} />
                                        :
                                            <input name="weight" className="form-control input-options" readOnly defaultValue={this.props.product.product.weight} onBlur={this.checkDecimals} origvalue={this.props.product.product.weight} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">Regular Price (dec):<p id="regularPrice_error" className="callout">Entered value must be a decimal number</p></label>
                            <div className="col-md-4">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.regularPrice != undefined ?
                                            <input name="regularPrice" className="form-control input-options" defaultValue={this.props.overrides.regularPrice} onBlur={this.checkDecimals} origvalue={this.props.product.product.regularPrice} />
                                        :
                                            <input name="regularPrice" className="form-control input-options" readOnly defaultValue={this.props.product.product.regularPrice} onBlur={this.checkDecimals} origvalue={this.props.product.product.regularPrice} />
                                    }
                                </div>
                            </div>
                            <label className="col-md-2 control-label">Sale Price (dec):<p id="salePrice_error" className="callout">Entered value must be a decimal number</p></label>
                            <div className="col-md-4">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.salePrice != undefined ?
                                            <input name="salePrice" className="form-control input-options" defaultValue={this.props.overrides.salePrice} onBlur={this.checkDecimals} origvalue={this.props.product.product.salePrice} />
                                        :
                                            <input name="salePrice" className="form-control input-options" readOnly defaultValue={this.props.product.product.salePrice} onBlur={this.checkDecimals} origvalue={this.props.product.product.salePrice} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-2 control-label">MSRP Price (dec):<p id="msrpPrice_error" className="callout">Entered value must be a decimal number</p></label>
                            <div className="col-md-4">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.msrpPrice != undefined ?
                                            <input name="msrpPrice" className="form-control input-options" defaultValue={this.props.overrides.msrpPrice} onBlur={this.checkDecimals} origvalue={this.props.product.product.msrpPrice} />
                                        :
                                            <input name="msrpPrice" className="form-control input-options" readOnly defaultValue={this.props.product.product.msrpPrice} onBlur={this.checkDecimals} origvalue={this.props.product.product.msrpPrice} />
                                    }
                                </div>
                            </div>
                            <label className="col-md-2 control-label">MAP Price (dec):<p id="mapPrice_error" className="callout">Entered value must be a decimal number</p></label>
                            <div className="col-md-4">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <input type="checkbox" onClick={this.enableDisable} />
                                    </div>
                                    {
                                        this.props.overrides.mapPrice != undefined ?
                                            <input name="mapPrice" className="form-control input-options" defaultValue={this.props.overrides.mapPrice} onBlur={this.checkDecimals} origvalue={this.props.product.product.mapPrice} />
                                        :
                                            <input name="mapPrice" className="form-control input-options" readOnly defaultValue={this.props.product.product.mapPrice} onBlur={this.checkDecimals} origvalue={this.props.product.product.mapPrice} />
                                    }
                                </div>
                            </div>
                        </div>
                    </form>

                    <div id="choices">
                        <button className="btn" id="clear" onClick={this.clearOverrides} >Clear All Overrides</button>
                        {
                            this.state.name_error ||
                            this.state.startDate_error || this.state.endDate_error ||
                            this.state.minimumQty_error || this.state.maximumQty_error ||
                            this.state.inStockQuantity_error || this.state.weight_error ||
                            this.state.regularPrice_error || this.state.salePrice_error ||
                            this.state.msrpPrice_error || this.state.mapPrice_error ?
                                <button className="btn btn-primary" id="submit_overrides" disabled >Submit Changes</button>
                            :
                                <button className="btn btn-primary" id="submit_overrides" onClick={this.saveOverrides} >Submit Changes</button>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    product: state.product,
    overrides: state.overrides.overrides
});

export default connect(mapStateToProps)(WebPanel)