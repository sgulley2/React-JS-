import React from 'react'
import Modal from 'react-modal'

import CommError from '../Errors/Errors'

import './CreateEditSeries.css'

const styling = {
    content: {
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100%',
        paddingTop: '10px',
        paddingLeft: '45px',
        background: 'white',
    }
}

const CreateEditSeries = (
    {
        errSer,
        errSerClear,

        bricksList,

        curSeries,
        tmpSeries,

        create,
        isOpen,

        onAfterOpen,
        onRequestClose,
        onRequestCancel,

        nameChange,

        selSkuBricksDirty,
        selDataBricksDirty,
        selDisplayBricksDirty,
        selFilterBricksDirty,

        brickSelect,

        selAll,
        selSel,
        unSel,
        unSelAll,
        promoteTop,
        promote,
        demote,
        demoteBottom
    }) => {
        const skuPublished = create 
            ? curSeries.published === 1 
            : tmpSeries.published === 1;

        return (
            <Modal isOpen={isOpen} onAfterOpen={onAfterOpen} onRequestClose={onRequestClose} style={styling}>
                <CommError error={errSer.error} onClose={errSerClear} />

                <div className="create-edit-series">        
                    <h1>{create ? 'Edit' : 'Create'} Series</h1>
                    <p className="sublabel">A Product Series is a collection of Product Bricks and is used for defining the uniqueness within a set of products including the data to be entered about a product, the attributes that will be published on the website, and the configured Reico SKU.</p>
        
                    <p className="required">*= Required for Publishing</p>
        
                    <div>
                            {create ? 
                                <div className="form-group">
                                    <label htmlFor="ser_id">ProductSeries ID:</label>
                                    <span id="ser_id">{curSeries.productSeriesId}</span>
                                </div> : ""
                            }
        
                            <div className="form-group">
                                <label htmlFor="ser_name">Name:*</label>
                                <input className="form-control" id="ser_name" published={skuPublished} defaultValue={create ? curSeries.name : tmpSeries.name} onChange={nameChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="ser_notes" className="opts notes">Notes:</label>
                                <textarea className="form-control" id="ser_notes" defaultValue={create ? curSeries.notes : tmpSeries.notes} />
                            </div>
                            <div className="form-group">
                                <label>Reico SKU Bricks:*</label>
                                    <div className="opts-main">
                                        <div className="opts-box">
                                            <p>Available Bricks</p>
                                            <select className="multibox sku form-control" multiple disabled={skuPublished ? "disabled" : ""}>
                                                {bricksList.filter((brk) => {
                                                    let notFound = true;
        
                                                    !create || selSkuBricksDirty ?
                                                        tmpSeries.reicoSkuBricks.map((skubrk) => {
                                                            if (brk.name === skubrk.name)
                                                                notFound = false;
                                                        })
        
                                                    :
        
                                                        curSeries.reicoSkuBricks.map((skubrk) => {
                                                            if (brk.name === skubrk.name)
                                                                notFound = false;
                                                        })
        
                                                    return notFound;    
                                                })
                                                .map((option, index) => {
                                                    return <option className="series" key={index}>{option.name}</option>
                                                })}
                                            </select>
                                            <div className="opts-box-buttons">
                                                <button className="multibox sku btn" published={skuPublished} onClick={selAll} disabled={skuPublished ? "disabled" : ""}><i className="fa fa-angle-double-right"></i></button>
                                                <button className="multibox sku btn" published={skuPublished} onClick={selSel} disabled={skuPublished ? "disabled" : ""}><i className="fa fa-angle-right"></i></button>
                                                <button className="multibox sku btn" published={skuPublished} onClick={unSel} disabled={skuPublished ? "disabled" : ""}><i className="fa fa-angle-left"></i></button>
                                                <button className="multibox sku btn" published={skuPublished} onClick={unSelAll} disabled={skuPublished ? "disabled" : ""}><i className="fa fa-angle-double-left"></i></button>
                                            </div>
                                            {
                                                !bricksList.length ?
                                                    <p className="brick-error">An error has occurred on the server. Please contact support team so that it can be investigated</p>
                                                :
                                                    null
                                            }
                                        </div>
                                        <div className="opts-box">
                                            <p>Selected Bricks</p>
                                            <ul className="series form-control" disabled={skuPublished ? "disabled" : ""}>
                                                {
                                                    !create || selSkuBricksDirty ?
                                                        tmpSeries.reicoSkuBricks.map((option, index) => {
                                                            return <li className="series sku" key={index} onClick={brickSelect}>{option.name}</li>
                                                        })
        
                                                    :
        
                                                        curSeries.reicoSkuBricks.length ?
                                                            curSeries.reicoSkuBricks.map((option, index) => {
                                                                return <li className="series sku" key={index} onClick={brickSelect}>{option.name}</li>
                                                            })
        
                                                        :
        
                                                            null
                                                }
                                            </ul>
                                            <div className="opts-box-buttons">
                                                <button className="multibox sku btn" published={skuPublished} onClick={promoteTop} disabled={skuPublished ? "disabled" : ""}><i className="fa fa-angle-double-up"></i></button>
                                                <button className="multibox sku btn" published={skuPublished} onClick={promote} disabled={skuPublished ? "disabled" : ""}><i className="fa fa-angle-up"></i></button>
                                                <button className="multibox sku btn" published={skuPublished} onClick={demote} disabled={skuPublished ? "disabled" : ""}><i className="fa fa-angle-down"></i></button>
                                                <button className="multibox sku btn" published={skuPublished} onClick={demoteBottom} disabled={skuPublished ? "disabled" : ""}><i className="fa fa-angle-double-down"></i></button>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="form-group">
                                <label>Supplemental Data Bricks:</label>
                                    <div className="opts-main">
                                        <div className="opts-box">
                                            <p>Available Bricks</p>
                                            <select className="multibox supp form-control" multiple>
                                                {bricksList.filter((brk) => {
                                                    let notFound = true;
        
                                                    !create || selDataBricksDirty ?
                                                        tmpSeries.supplementalDataBricks.map((skubrk) => {
                                                            if (brk.name === skubrk.name)
                                                                notFound = false;
                                                        })
        
                                                    :
        
                                                        curSeries.supplementalDataBricks.map((skubrk) => {
                                                            if (brk.name === skubrk.name)
                                                                notFound = false;
                                                        })
        
                                                    return notFound;
                                                })
                                                .map((option, index) => {
                                                    return <option className="series" key={index}>{option.name}</option>
                                                })}
                                            </select>
                                            <div className="opts-box-buttons">
                                                <button className="multibox supp btn" onClick={selAll}><i className="fa fa-angle-double-right"></i></button>
                                                <button className="multibox supp btn" onClick={selSel}><i className="fa fa-angle-right"></i></button>
                                                <button className="multibox supp btn" onClick={unSel}><i className="fa fa-angle-left"></i></button>
                                                <button className="multibox supp btn" onClick={unSelAll}><i className="fa fa-angle-double-left"></i></button>
                                            </div>
                                            {
                                                !bricksList.length ?
                                                    <p className="brick-error">An error has occurred on the server. Please contact support team so that it can be investigated</p>
                                                :
                                                    null
                                            }
                                        </div>
                                        <div className="opts-box">
                                            <p>Selected Bricks</p>
                                            <ul className="series form-control">
                                                {
                                                    !create || selDataBricksDirty ?
                                                        tmpSeries.supplementalDataBricks.map((option, index) => {
                                                            return <li className="series supp" key={index} onClick={brickSelect}>{option.name}</li>
                                                        })
        
                                                    :
        
                                                        curSeries.supplementalDataBricks.length ?
                                                            curSeries.supplementalDataBricks.map((option, index) => {
                                                                return <li className="series supp" key={index} onClick={brickSelect}>{option.name}</li>
                                                            })
        
                                                        :
        
                                                            null
                                                }
                                            </ul>
                                        </div>
                                    </div>
                            </div>
                            <div className="form-group">
                                <label>Display Attribute Bricks:</label>
                               
                                    <div className="opts-main">
                                        <div className="opts-box">
                                            <p>Available Bricks</p>
                                            <select className="multibox disp form-control" multiple>
                                                {bricksList.filter((brk) => {
                                                    let notFound = true;
        
                                                    !create || selDisplayBricksDirty ?
                                                        tmpSeries.displayAttributesBricks.map((skubrk) => {
                                                            if (brk.name === skubrk.name)
                                                                notFound = false;
                                                        })
        
                                                    :
        
                                                        curSeries.displayAttributesBricks.map((skubrk) => {
                                                            if (brk.name === skubrk.name)
                                                                notFound = false;
                                                        })
        
                                                    return notFound;
                                                })
                                                .map((option, index) => {
                                                    return <option className="series" key={index}>{option.name}</option>
                                                })}
                                            </select>
                                            <div className="opts-box-buttons">
                                                <button className="multibox disp btn" onClick={selAll}><i className="fa fa-angle-double-right"></i></button>
                                                <button className="multibox disp btn" onClick={selSel}><i className="fa fa-angle-right"></i></button>
                                                <button className="multibox disp btn" onClick={unSel}><i className="fa fa-angle-left"></i></button>
                                                <button className="multibox disp btn" onClick={unSelAll}><i className="fa fa-angle-double-left"></i></button>
                                            </div>
                                            {
                                                !bricksList.length ?
                                                    <p className="brick-error">An error has occurred on the server. Please contact support team so that it can be investigated</p>
                                                :
                                                    null
                                            }
                                        </div>
                                        <div className="opts-box">
                                            <p>Selected Bricks</p>
                                            <ul className="series form-control">
                                                {
                                                   !create || selDisplayBricksDirty ?
                                                        tmpSeries.displayAttributesBricks.map((option, index) => {
                                                            return <li className="series disp" key={index} onClick={brickSelect}>{option.name}</li>
                                                        })
        
                                                   :
        
                                                        curSeries.displayAttributesBricks.length ?
                                                            curSeries.displayAttributesBricks.map((option, index) => {
                                                                return <li className="series disp" key={index} onClick={brickSelect}>{option.name}</li>
                                                            })
        
                                                        :
        
                                                            null
                                                }
                                            </ul>
                                        </div>
                                    </div>
                            </div>
                            <div className="form-group">
                                <label>Filterable Attribute Bricks:</label>
                                    <div className="opts-main">
                                        <div className="opts-box">
                                            <p>Available Bricks</p>
                                            <select className="multibox filt form-control" multiple>
                                                {bricksList.filter((brk) => {
                                                    let notFound = true;
        
                                                    !create || selFilterBricksDirty ?
                                                        tmpSeries.filteredAttributesBricks.map((skubrk) => {
                                                            if (brk.name === skubrk.name)
                                                                notFound = false;
                                                        })
        
                                                    :
        
                                                        curSeries.filteredAttributesBricks.map((skubrk) => {
                                                            if (brk.name === skubrk.name)
                                                                notFound = false;
                                                        })
        
                                                    return notFound;
                                                })
                                                .map((option, index) => {
                                                        return <option className="series" key={index}>{option.name}</option>
                                                })}
                                            </select>
                                            <div className="opts-box-buttons">
                                                <button className="multibox filt btn" onClick={selAll}><i className="fa fa-angle-double-right"></i></button>
                                                <button className="multibox filt btn" onClick={selSel}><i className="fa fa-angle-right"></i></button>
                                                <button className="multibox filt btn" onClick={unSel}><i className="fa fa-angle-left"></i></button>
                                                <button className="multibox filt btn" onClick={unSelAll}><i className="fa fa-angle-double-left"></i></button>
                                            </div>
                                            {
                                                !bricksList.length ?
                                                    <p className="brick-error">An error has occurred on the server. Please contact support team so that it can be investigated</p>
                                                :
                                                    null
                                            }
                                        </div>
                                        <div className="opts-box">
                                            <p>Selected Bricks</p>
                                            <ul className="series form-control">
                                                {
                                                    !create || selFilterBricksDirty ?
                                                        tmpSeries.filteredAttributesBricks.map((option, index) => {
                                                            return <li className="series filt" key={index} onClick={brickSelect}>{option.name}</li>
                                                        })
        
                                                    :
        
                                                        curSeries.filteredAttributesBricks.length ?
                                                            curSeries.filteredAttributesBricks.map((option, index) => {
                                                                return <li className="series filt" key={index} onClick={brickSelect}>{option.name}</li>
                                                            })
        
                                                        :
        
                                                            null
                                                }
                                            </ul>
                                        </div>
                                    </div>
                            </div>
                    </div>
        
                    <div className="form-group buttons">
                        <a className="btn btn-default" onClick={onRequestCancel}>Cancel</a>&nbsp;
                        <button className="btn btn-info series draft" create={create ? "false" : "true"} draft="true" published={create ? curSeries.published : tmpSeries.published} onClick={onRequestClose}>Save As Draft</button>&nbsp;
                        <button className="btn btn-primary series publish" create={create ? "false" : "true"} onClick={onRequestClose}>Publish</button>
                    </div>
                </div>
            </Modal>);
    } 

Modal.setAppElement('body');
        
export default CreateEditSeries