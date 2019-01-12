import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

import ImageGallery from 'react-image-gallery'
import { apiUrlBase } from '../../../../GlobalStateContainer/actions'

import './Image.css'
import '../../../../../../node_modules/react-image-gallery/styles/scss/image-gallery.scss'


class ImagePanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            Limages: [],
            Mimages: [],
            Iimages: [],
            Simage:  []
        }
    }

    componentDidMount() {
        let Limages = []
        let Mimages = []
        let Iimages = []
        let Simage =  []


        if (this.props.product.productImagesLarge.length)
            this.props.product.productImagesLarge.map((img) => {
                Limages.push({
                    original: apiUrlBase + img,
                    thumbnail: apiUrlBase + img
                })
            })

        if (this.props.product.productImagesMedium.length)
            this.props.product.productImagesMedium.map((img) => {
                Mimages.push({
                    original: apiUrlBase + img,
                    thumbnail: apiUrlBase + img
                })
            })

        if (this.props.product.productImagesIcon.length)
            this.props.product.productImagesIcon.map((img) => {
                Iimages.push({
                    original: apiUrlBase + img,
                    thumbnail: apiUrlBase + img
                })
            })

        if (this.props.product.selectorImageURL.length)
            Simage.push({
                original: apiUrlBase + this.props.product.selectorImageURL,
                thumbnail: apiUrlBase + this.props.product.selectorImageURL
            })

        this.setState({
            Limages: Limages,
            Mimages: Mimages,
            Iimages: Iimages,
            Simage:  Simage
        })

        $('div.selector-color').css('background-color', this.props.product.colorSwatch)
    }

    render() {
        return (
            <div className="imagePanel">
                <div className="images L-images">
                    <div className="image-lbl">
                        <span>Large Image</span>
                    </div>

                    <div className="image-list">
                        <div className="image">
                            <ImageGallery items={this.state.Limages} thumbnailPosition="right" />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="override-lbl">
                        <span>Override Image Base</span>
                    </div>

                    <div className="override">
                        <input disabled defaultValue={this.props.product.overrideImageBaseName} />
                    </div>
                </div>

                <hr />

                <div className="images M-images">
                    <div className="image-lbl">
                        <span>Medium Image</span>
                    </div>

                    <div className="image-list">
                        <div className="image">
                            <ImageGallery items={this.state.Mimages} thumbnailPosition="right" />
                        </div>
                    </div>
                </div>

                <hr />

                <div className="images I-images">
                    <div className="image-lbl">
                        <span>Icon Image</span>
                    </div>

                    <div className="image-list">
                        <div className="image">
                            <ImageGallery items={this.state.Iimages} thumbnailPosition="right" />
                        </div>
                    </div>
                </div>

                <hr />

                <div className="images S-images">
                    <div className="image-lbl">
                        <span>Selector Image</span>
                    </div>

                    <div className="image-list">
                        <div className="image">
                            {
                                this.props.product.selectorImageType === "color" ?
                                    <div className="selector-color"></div>
                                :
                                    <ImageGallery items={this.state.Simage} showThumbnails="false" />
                            }
                        </div>
                    </div>
                </div>

                <div>
                    <div className="override-lbl">
                        <span>Swatch Image Override</span>
                    </div>

                    <div className="override">
                        <input disabled defaultValue={this.props.product.swatchImageName} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    product: state.product.product
});

export default connect(mapStateToProps)(ImagePanel)