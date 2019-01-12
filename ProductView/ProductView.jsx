import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import $ from 'jquery'

import GeneralPanel from './Panels/General/General'
import WebPanel from './Panels/Web/Web'
import CatAttribPanel from './Panels/CatAttrib/CatAttrib'
import ImagePanel from './Panels/Image/Image'

import './ProductView.css'


class ProductViewMain extends React.Component {
    constructor(props) {
        super(props);

        this.selectPanel = this.selectPanel.bind(this)
        this.goBack = this.goBack.bind(this)
    }

    componentDidMount() {
        $('div#General').css('display', 'block')
        $('li[panel="General"]').addClass('selected')
    }

    selectPanel(e) {
        $('div.panelFrame').css('display', 'none')
        $('li.productview').removeClass("selected")

        e.currentTarget.className = "productview selected"
        $('div#' + e.currentTarget.attributes["panel"].value).css('display','block')
    }

    goBack() {
        this.props.history.push('/AdvancedSearchList')
    }

    render() {
        return (
            <div className="productView">
                <h1>{this.props.product.product.name}</h1>

                <ul>
                    <li className="productview" panel="General" onClick={this.selectPanel}>General</li>
                    <li className="productview" panel="Stock" disabled>Stock Management</li>
                    <li className="productview" panel="Pricing" disabled>Pricing</li>
                    <li className="productview" panel="Warehouse" disabled>Warehouse</li>
                    <li className="productview" panel="Category" onClick={this.selectPanel}>Category-Attributes</li>
                    <li className="productview" panel="Web" onClick={this.selectPanel}>Web</li>
                    <li className="productview" panel="Image" onClick={this.selectPanel}>Image</li>
                    <li className="productview" panel="History" disabled>History</li>
                </ul>

                <i className="fa fa-arrow-circle-left" onClick={this.goBack}><span>Back</span></i>

                <div className="panelFrame" id="General"><GeneralPanel /></div>
                <div className="panelFrame" id="Stock"><p className="panelFrame">Stock Management Panel TBD</p></div>
                <div className="panelFrame" id="Pricing"><p className="panelFrame">Pricing Panel TBD</p></div>
                <div className="panelFrame" id="Warehouse"><p className="panelFrame">Warehouse Panel TBD</p></div>
                <div className="panelFrame" id="Category"><CatAttribPanel /></div>
                <div className="panelFrame" id="Web"><WebPanel /></div>
                <div className="panelFrame" id="Image"><ImagePanel /></div>
                <div className="panelFrame" id="History"><p className="panelFrame">History Panel TBD</p></div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    product: state.product
});

export default connect(mapStateToProps)(withRouter(ProductViewMain))