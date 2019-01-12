import React from 'react'
import { connect } from 'react-redux';

import ProductSeries from './ProductSeries'
import { fetchSeriesList } from '../../GlobalStateContainer/actions'


class ProductSeriesList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.dispatch(fetchSeriesList)
    }

    render() {
        return (
            <ProductSeries seriesList={this.props.series.seriesList} />
        );
    }
}

const mapStateToProps = state => ({
    series: state.series
});

export default connect(mapStateToProps)(ProductSeriesList)
