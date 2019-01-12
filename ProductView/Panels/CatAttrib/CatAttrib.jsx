import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

import './CatAttrib.css'

class CatAttribPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="catattribPanel">
                <div className="attributes">
                    <div className="attrib-lbl">
                        <span>Web Categories:</span>
                    </div>
                    <ul>
                        {
                            this.props.product.websiteCategory1 && this.props.product.websiteCategory1.length ?
                                <option>{this.props.product.websiteCategory1}</option>
                            :
                                null
                        }
                        {
                            this.props.product.websiteCategory2 && this.props.product.websiteCategory2.length ?
                                <option>{this.props.product.websiteCategory2}</option>
                            :
                                null
                        }
                    </ul>
                </div>

                <div className="attributes">
                    <div className="attrib-lbl">
                        <span>Display Attributes:</span>
                    </div>
                    <ul>
                        {
                            this.props.product.displayAttributes ?
                                this.props.product.displayAttributes.map((attr) => {
                                    return <option>{attr.attributeName} - {attr.attributeValueName}</option>
                                })
                            :
                                null
                        }
                    </ul>
                </div>

                <div className="attributes">
                    <div className="attrib-lbl">
                        <span>Filterable Attributes:</span>
                    </div>
                    <ul>
                        {
                            this.props.product.filterableAttributes ?
                                this.props.product.filterableAttributes.map((attr) => {
                                    return <option>{attr.attributeName} - {attr.attributeValueName}</option>
                                })
                            :
                                null
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    product: state.product.product
});

export default connect(mapStateToProps)(CatAttribPanel)