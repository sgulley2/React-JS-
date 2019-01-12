import React from 'react'
import { connect } from 'react-redux'

import ProductBricks from './ProductBricks'
import { fetchBricksList } from '../../GlobalStateContainer/actions'


class ProductBricksList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.dispatch(fetchBricksList)
    }

    render() {
        return (
            <ProductBricks bricksList={this.props.bricks.bricksList} />
        );
    }
}

const mapStateToProps = state => ({
    bricks: state.bricks
});

export default connect(mapStateToProps)(ProductBricksList)
