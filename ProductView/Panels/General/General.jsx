import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

import './General.css'

class GeneralPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="generalPanel">
                <div class="row">
                    <div className="col-xs-6">
                        <table>
                            <tbody>
                                <tr>
                                    <td className="lbl"><span>Product Name:</span></td>
                                    <td><input disabled defaultValue={this.props.product.product.name} /></td>
                                </tr>
                                <tr>
                                    <td className="lbl"><span>Manufacturer:</span></td>
                                    <td>
                                        <input disabled className="short" defaultValue={""} />
                                        <div className="codewrapper">
                                            <div className="intcodewrapper">
                                                <span>Code:</span>
                                            </div>
                                            <div className="inputwrapper">
                                                <input disabled defaultValue={this.props.product.product.brmfg} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="lbl"><span>Brand:</span></td>
                                    <td><input disabled defaultValue={""} /></td>
                                </tr>
                                <tr>
                                    <td className="lbl"><span>Product Line:</span></td>
                                    <td>
                                        <input disabled className="short" defaultValue={""} />
                                        <div className="codewrapper">
                                            <div className="intcodewrapper">
                                                <span>Code:</span>
                                            </div>
                                            <div className="inputwrapper">
                                                <input disabled defaultValue={this.props.product.product.brlin} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="lbl"><span>Part Number:</span></td>
                                    <td><input disabled defaultValue={this.props.product.product.brpart} /></td>
                                </tr>
                                <tr>
                                    <td className="lbl"><span>Reico SKU:</span></td>
                                    <td><input disabled defaultValue={this.props.product.product.code} /></td>
                                </tr>
                                <tr>
                                    <td className="lbl"><span>Vendor SKU:</span></td>
                                    <td><input disabled defaultValue={""} /></td>
                               </tr>
                                <tr>
                                    <td className="lbl"><span>UPC Code:</span></td>
                                    <td><input disabled defaultValue={this.props.product.product.brupc} /></td>
                                </tr>
                                <tr>
                                    <td className="lbl"><span>Cost:</span></td>
                                    <td>
                                        <input disabled className="extra-short" defaultValue={this.props.product.product.brcost} />                                  
                                        <div className="codewrapper2">
                                            <div className="intcodewrapper">
                                                <span>Categories:</span>
                                            </div>
                                            <div className="inputwrapper2">
                                                <input disabled className="medium" defaultValue={this.props.product.product.websiteCategory1 + ', ' + this.props.product.product.websiteCategory2} />
                                            </div>
                                        </div>

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-xs-6">
                        <div className="prod-options">
                            {
                                this.props.product.product.supplementalAttributes.map((attr) => {
                                    return <p>{attr.attributeName} - {attr.attributeValueName}</p>
                                })
                            }
                        </div>
                    </div>
                </div>
                <table className="lists table table-striped">
                    <thead>
                        <tr>
                            <th>Location</th>
                            <th>Quantity</th>
                            <th>Minimum</th>
                            <th>On PO</th>
                            <th>On Order</th>
                            <th>Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Springfield</td>
                            <td>{this.props.product.product.brqtyaspr}</td>
                            <td>{this.props.product.product.minimumQty}</td>
                            <td></td>
                            <td></td>
                            <td>{this.props.product.product.inStockQuantity}</td>
                        </tr>
                        <tr>
                            <td>Elkridge</td>
                            <td>{this.props.product.product.brqtyaelk}</td>
                            <td>{this.props.product.product.minimumQty}</td>
                            <td></td>
                            <td></td>
                            <td>{this.props.product.product.inStockQuantity}</td>
                        </tr>
                        <tr>
                            <td>Raleigh</td>
                            <td>{this.props.product.product.brqtyaral}</td>
                            <td>{this.props.product.product.minimumQty}</td>
                            <td></td>
                            <td></td>
                            <td>{this.props.product.product.inStockQuantity}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    product: state.product
});

export default connect(mapStateToProps)(GeneralPanel)