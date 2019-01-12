import React from 'react'
import { connect } from 'react-redux';
import $ from 'jquery'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import './ProductSeries.css'

import CreateEditSeries from './CreateEditSeries'

import { fetchSer } from '../../GlobalStateContainer/actions'
import { fetchSerError } from '../../GlobalStateContainer/actions'
import { createSer } from '../../GlobalStateContainer/actions'
import { updateSer } from '../../GlobalStateContainer/actions'
import { errorSer } from '../../GlobalStateContainer/actions'

import { fetchSeriesList } from '../../GlobalStateContainer/actions'
import { fetchBricksList } from '../../GlobalStateContainer/actions'

import CommError from '../Errors/Errors'

var Spinner = require('react-spinkit');

let chkReturn = 0;

class ProductSeries extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editSeriesMode: false,

            ser: {
                name: '',
                notes: '',
                published: '0',
                reicoSkuBricks: [],
                supplementalDataBricks: [],
                displayAttributesBricks: [],
                filteredAttributesBricks: []
            },

            reicoSkuBricksDirty: false,
            supplementalDataBricksDirty: false,
            displayAttributesBricksDirty: false,
            filteredAttributesBricksDirty: false
        };

        this.fetchSerErrorClear = this.fetchSerErrorClear.bind(this);
        this.errorSerClear = this.errorSerClear.bind(this);

        this.seriesEdit = this.seriesEdit.bind(this);
        this.seriesEditVerify = this.seriesEditVerify.bind(this);
        this.seriesCreate = this.seriesCreate.bind(this);
        this.updateSeries = this.updateSeries.bind(this);
        this.cancelSeries = this.cancelSeries.bind(this);
        this.closeSeries = this.closeSeries.bind(this);

        this.nameChange = this.nameChange.bind(this);

        this.brickSelect = this.brickSelect.bind(this);

        this.initBricks = this.initBricks.bind(this);
        this.updateBricks = this.updateBricks.bind(this);

        this.selAll = this.selAll.bind(this);
        this.selSel = this.selSel.bind(this);
        this.unSel = this.unSel.bind(this);
        this.unSelAll = this.unSelAll.bind(this);
        this.promoteTop = this.promoteTop.bind(this);
        this.promote = this.promote.bind(this);
        this.demote = this.demote.bind(this);
        this.demoteBottom = this.demoteBottom.bind(this);
    }

    componentWillMount() {
        if (!this.props.bricksList.length)
            this.props.dispatch(fetchBricksList)
    }

    nameChange() {
        if ($('#ser_name').val().length) {
            $('button.draft').removeAttr('disabled')

            if (this.state.ser.reicoSkuBricks.length)
                $('button.publish').removeAttr('disabled')
        }
        else {
            $('button.series').each(function () {
                $(this).attr('disabled', 'disabled')
            })
        }
    }

    afterOpen() {
        if ($('#ser_name').attr('published') === '1') 
            $('#ser_name').attr('disabled', 'disabled')

        if ($('button.draft').attr('published') === '1')
            $('button.draft').attr('disabled', 'disabled')

        if ($('li.sku').length === 0)
            $('button.publish').attr('disabled', 'disabled')

        $('button.series').each(function () {
            if ($(this).attr('create') === 'true')
                $(this).attr('disabled', 'disabled')
        })
    }

    fetchSerErrorClear() {
        this.props.dispatch(fetchSerError);
    }

    errorSerClear(e) {
        this.props.dispatch(errorSer);

        if (e.currentTarget.attributes.code && e.currentTarget.attributes.code.value === "409")
            fetchSer.bind(this)(e.currentTarget.attributes.id.value);
    }

    seriesEdit(e) {

        if (chkReturn) return;
        chkReturn = 1;

        let id = e.target.attributes.ser.value;

        this.setState({
            ser: {
                name: '',
                notes: '',
                published: '0',
                reicoSkuBricks: [],
                supplementalDataBricks: [],
                displayAttributesBricks: [],
                filteredAttributesBricks: []
            },

            reicoSkuBricksDirty: false,
            supplementalDataBricksDirty: false,
            displayAttributesBricksDirty: false,
            filteredAttributesBricksDirty: false
        });

        fetchSer.bind(this)(id);

        chkReturn = setInterval(this.seriesEditVerify, 100);
    }
    seriesEditVerify() {
        if (this.props.ser.updated || this.props.ser.error) {
            if (this.props.ser.updated) {
                this.setState({
                    editSeries: true,
                    editSeriesMode: true
                });

                $('.navbar-static-top').css('z-index', 0);

                $('select.multibox').each(function () {
                    $(this).val([]);
                })
            }

            clearInterval(chkReturn);
            chkReturn = 0;
        }
    }
    seriesCreate() {
        this.setState({
            editSeries: false,
            editSeriesMode: true,

            ser: {
                name: '',
                notes: '',
                published: '0',
                reicoSkuBricks: [],
                supplementalDataBricks: [],
                displayAttributesBricks: [],
                filteredAttributesBricks: []
            },

            reicoSkuBricksDirty: false,
            supplementalDataBricksDirty: false,
            displayAttributesBricksDirty: false,
            filteredAttributesBricksDirty: false
        });

        $('.navbar-static-top').css('z-index', 0);
    }
    updateSeries(e) {
        $('button.series').attr('disabled', 'disabled')

        let create = e.target.attributes.create.value;
        let draft = e.target.attributes.draft !== undefined;
        let ser = {
            name: $('#ser_name').val().trim(),
            notes: $('#ser_notes').val(),
            reicoSkuBricks: Object.assign([], (this.state.ser.reicoSkuBricks.length ? this.state.ser.reicoSkuBricks : this.props.ser.ser.reicoSkuBricks).map((brick) => { return brick.productBrickId; })),
            supplementalDataBricks: Object.assign([], (this.state.ser.supplementalDataBricks.length ? this.state.ser.supplementalDataBricks : this.props.ser.ser.supplementalDataBricks).map((brick) => { return brick.productBrickId; })),
            displayAttributesBricks: Object.assign([], (this.state.ser.displayAttributesBricks.length ? this.state.ser.displayAttributesBricks : this.props.ser.ser.displayAttributesBricks).map((brick) => { return brick.productBrickId; })),
            filteredAttributesBricks: Object.assign([], (this.state.ser.filteredAttributesBricks.length ? this.state.ser.filteredAttributesBricks : this.props.ser.ser.filteredAttributesBricks).map((brick) => { return brick.productBrickId; }))
        };

        ser.published = !draft ? 1 : 0

        if (create === 'true') {
            createSer.bind(this)(ser);
        }
        else {
            ser.productSeriesId = parseInt($('#ser_id').text());
            updateSer.bind(this)(ser.productSeriesId, ser);
        }

        chkReturn = setInterval(this.closeSeries, 100);
    }
    cancelSeries() {
        this.props.dispatch(errorSer);

        $('div.multi-select').each(function () {
            $(this).removeClass('open');
        })

        this.setState({
            editSeriesMode: false,
        });

        $('.navbar-static-top').css('z-index', 1000);
    }
    closeSeries() {
        if (this.props.ser.updated || this.props.ser.error) {
            $('button.series').removeAttr('disabled')

            if (this.props.ser.updated) {
                this.cancelSeries();

                this.props.dispatch(fetchSeriesList);
            }

            clearInterval(chkReturn);
            chkReturn = 0;
        }
    }

    brickSelect(e) {
        if (e.currentTarget.className.includes('sku')) {
            $('li.series.sku').each(function () {
                $(this).removeClass('selected');
            })
            e.target.className = "series sku selected";
        }
        else if (e.currentTarget.className.includes('supp')) {
            $('li.series.supp').each(function () {
                $(this).removeClass('selected');
            })
            e.target.className = "series supp selected";
        }
        else if (e.currentTarget.className.includes('disp')) {
            $('li.series.disp').each(function () {
                $(this).removeClass('selected');
            })
            e.target.className = "series disp selected";
        }
       else if (e.currentTarget.className.includes('filt')) {
            $('li.series.filt').each(function () {
                $(this).removeClass('selected');
            })
            e.target.className = "series filt selected";
        }
    }

    initBricks(e, ser) {
        if (!this.state.editSeries) return

        if (e.currentTarget.className.includes('sku') && !this.state.reicoSkuBricksDirty) {
            ser.reicoSkuBricks = Object.assign([], this.props.ser.ser.reicoSkuBricks);
        }
        else if (e.currentTarget.className.includes('supp') && !this.state.supplementalDataBricksDirty) {
            ser.supplementalDataBricks = Object.assign([], this.props.ser.ser.supplementalDataBricks);
        }
        else if (e.currentTarget.className.includes('disp') && !this.state.displayAttributesBricksDirty) {
            ser.displayAttributesBricks = Object.assign([], this.props.ser.ser.displayAttributesBricks);
        }
        else if (e.currentTarget.className.includes('filt') && !this.state.filteredAttributesBricksDirty) {
            ser.filteredAttributesBricks = Object.assign([], this.props.ser.ser.filteredAttributesBricks);
        }
    }

    updateBricks(e, ser) {
        if (e.currentTarget.className.includes('sku')) {
            this.setState({
                ser: ser,
                reicoSkuBricksDirty: true
            });

            if (ser.reicoSkuBricks.length && $('#ser_name').val().length)
                $('button.publish').removeAttr('disabled')
            else
                $('button.publish').attr('disabled', 'disabled')
        }
        else if (e.currentTarget.className.includes('supp')) {
            ser.supplementalDataBricks.sort(function (a, b) {
                if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1
                else if (a.name.toLowerCase() > b.name.toLowerCase())
                    return 1
                else
                    return 0
            })

            this.setState({
                ser: ser,
                supplementalDataBricksDirty: true
            });
        }
        else if (e.currentTarget.className.includes('disp')) {
            ser.displayAttributesBricks.sort(function (a, b) {
                if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1
                else if (a.name.toLowerCase() > b.name.toLowerCase())
                    return 1
                else
                    return 0
            })

            this.setState({
                ser: ser,
                displayAttributesBricksDirty: true
            });
        }
        else if (e.currentTarget.className.includes('filt')) {
            ser.filteredAttributesBricks.sort(function (a, b) {
                if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1
                else if (a.name.toLowerCase() > b.name.toLowerCase())
                    return 1
                else
                    return 0
            })

            this.setState({
                ser: ser,
                filteredAttributesBricksDirty: true
            });
        }
    }

    selAll(e) {
        if (e.currentTarget.attributes.published && e.currentTarget.attributes.published.value === '1')
            return

        let ser = Object.assign({}, this.state.ser);

        if (e.currentTarget.className.includes('sku')) {
            ser.reicoSkuBricks = Object.assign([], this.props.bricksList);
        }
        else if (e.currentTarget.className.includes('supp')) {
            ser.supplementalDataBricks = Object.assign([], this.props.bricksList);
        }
        else if (e.currentTarget.className.includes('disp')) {
            ser.displayAttributesBricks = Object.assign([], this.props.bricksList);
        }
        else if (e.currentTarget.className.includes('filt')) {
            ser.filteredAttributesBricks = Object.assign([], this.props.bricksList);
        }

        this.updateBricks(e, ser);
    }
    selSel(e) {
        if (e.currentTarget.attributes.published && e.currentTarget.attributes.published.value === '1')
            return

        let sels;
        if (e.currentTarget.className.includes('sku')) {
            sels = $('select.multibox.sku').val();
        }
        else if (e.currentTarget.className.includes('supp')) {
            sels = $('select.multibox.supp').val();
        }
        else if (e.currentTarget.className.includes('disp')) {
            sels = $('select.multibox.disp').val();
        }
        else if (e.currentTarget.className.includes('filt')) {
            sels = $('select.multibox.filt').val();
        }

        let ser = Object.assign({}, this.state.ser);

        if (sels && sels.length) {
            let _this = this;

            this.initBricks(e, ser);

            sels.forEach(function (sel) {
                let selbrk;

                _this.props.bricksList.forEach((brk) => {
                    if (brk.name === sel) {
                        selbrk = brk;
                    }
                })

                if (e.currentTarget.className.includes('sku')) {
                    ser.reicoSkuBricks.push(selbrk);
                }
                else if (e.currentTarget.className.includes('supp')) {
                    ser.supplementalDataBricks.push(selbrk);
                }
                else if (e.currentTarget.className.includes('disp')) {
                    ser.displayAttributesBricks.push(selbrk);
                }
                else if (e.currentTarget.className.includes('filt')) {
                    ser.filteredAttributesBricks.push(selbrk);
                }
            });

            this.updateBricks(e, ser);

            if (e.currentTarget.className.includes('sku')) {
                $('select.multibox.sku').val([]);
            }
            else if (e.currentTarget.className.includes('supp')) {
                $('select.multibox.supp').val([]);
            }
            else if (e.currentTarget.className.includes('disp')) {
                $('select.multibox.disp').val([]);
            }
            else if (e.currentTarget.className.includes('filt')) {
                $('select.multibox.filt').val([]);
            }
        }
    }
    unSel(e) {
        if (e.currentTarget.attributes.published && e.currentTarget.attributes.published.value === '1')
            return

        let sel;
        let ser = Object.assign({}, this.state.ser);

        if (e.currentTarget.className.includes('sku')) {
            sel = $('li.series.sku.selected');
        }
        else if (e.currentTarget.className.includes('supp')) {
            sel = $('li.series.supp.selected');
        }
        else if (e.currentTarget.className.includes('disp')) {
            sel = $('li.series.disp.selected');
        }
        else if (e.currentTarget.className.includes('filt')) {
            sel = $('li.series.filt.selected');
        }

        if (sel.length) {
            let selbrk = sel.text();

            this.initBricks(e, ser);

            sel.removeClass('selected');
            if (e.currentTarget.className.includes('sku')) {
                ser.reicoSkuBricks = ser.reicoSkuBricks.filter((brk) => {
                    if (brk.name === selbrk)
                        return false
                    else
                        return true
                });
            }
            else if (e.currentTarget.className.includes('supp')) {
                ser.supplementalDataBricks = ser.supplementalDataBricks.filter((brk) => {
                    if (brk.name === selbrk)
                        return false
                    else
                        return true
                });
            }
            else if (e.currentTarget.className.includes('disp')) {
                ser.displayAttributesBricks = ser.displayAttributesBricks.filter((brk) => {
                    if (brk.name === selbrk)
                        return false
                    else
                        return true
                });
            }
            else if (e.currentTarget.className.includes('filt')) {
                ser.filteredAttributesBricks = ser.filteredAttributesBricks.filter((brk) => {
                    if (brk.name === selbrk)
                        return false
                    else
                        return true
                });
            }

            this.updateBricks(e, ser);
        }
    }
    unSelAll(e) {
        if (e.currentTarget.attributes.published && e.currentTarget.attributes.published.value === '1')
            return

        let ser = Object.assign({}, this.state.ser);

        if (e.currentTarget.className.includes('sku')) {
            ser.reicoSkuBricks = [];
        }
        else if (e.currentTarget.className.includes('supp')) {
            ser.supplementalDataBricks = [];
        }
        else if (e.currentTarget.className.includes('disp')) {
            ser.displayAttributesBricks = [];
        }
        else if (e.currentTarget.className.includes('filt')) {
            ser.filteredAttributesBricks = [];
        }

        this.updateBricks(e, ser);
    }
    promoteTop(e) {
        if (e.currentTarget.attributes.published && e.currentTarget.attributes.published.value === '1')
            return

        let sel;
        let ser = Object.assign({}, this.state.ser);

        if (e.currentTarget.className.includes('sku')) {
            sel = $('li.series.sku.selected');
        }
        else if (e.currentTarget.className.includes('supp')) {
            sel = $('li.series.supp.selected');
        }
        else if (e.currentTarget.className.includes('disp')) {
            sel = $('li.series.disp.selected');
        }
        else if (e.currentTarget.className.includes('filt')) {
            sel = $('li.series.filt.selected');
        }

        if (sel.length) {

            this.initBricks(e, ser);

            let source;
            if (e.currentTarget.className.includes('sku')) {
                ser.reicoSkuBricks.map((brk, index) => {
                    if (sel.text() === brk.name)
                        source = index;
                })
            }
            else if (e.currentTarget.className.includes('supp')) {
                ser.supplementalDataBricks.map((brk, index) => {
                    if (sel.text() === brk.name)
                        source = index;
                })
            }
            else if (e.currentTarget.className.includes('disp')) {
                ser.displayAttributesBricks.map((brk, index) => {
                    if (sel.text() === brk.name)
                        source = index;
                })
            }
            else if (e.currentTarget.className.includes('filt')) {
                ser.filteredAttributesBricks.map((brk, index) => {
                    if (sel.text() === brk.name)
                        source = index;
                })
            }

            if (source === 0) return;

            sel.removeClass('selected');
            
            if (e.currentTarget.className.includes('sku')) {
                $($('li.series.sku')[0]).addClass('selected');
            }
            else if (e.currentTarget.className.includes('supp')) {
                $($('li.series.supp')[0]).addClass('selected');
            }
            else if (e.currentTarget.className.includes('disp')) {
                $($('li.series.disp')[0]).addClass('selected');
            }
            else if (e.currentTarget.className.includes('filt')) {
                $($('li.series.filt')[0]).addClass('selected');
            }

            let swap;
            const destination = 0;
            if (e.currentTarget.className.includes('sku')) {
                swap = ser.reicoSkuBricks[destination];

                ser.reicoSkuBricks[destination] = ser.reicoSkuBricks[source];
                ser.reicoSkuBricks[source] = swap;
            }
            else if (e.currentTarget.className.includes('supp')) {
                swap = ser.supplementalDataBricks[destination];

                ser.supplementalDataBricks[destination] = ser.supplementalDataBricks[source];
                ser.supplementalDataBricks[source] = swap;
            }
            else if (e.currentTarget.className.includes('disp')) {
                swap = ser.displayAttributesBricks[destination];

                ser.displayAttributesBricks[destination] = ser.displayAttributesBricks[source];
                ser.displayAttributesBricks[source] = swap;
            }
            else if (e.currentTarget.className.includes('filt')) {
                swap = ser.filteredAttributesBricks[destination];

                ser.filteredAttributesBricks[destination] = ser.filteredAttributesBricks[source];
                ser.filteredAttributesBricks[source] = swap;
            }

            this.updateBricks(e, ser);
        }
    }
    promote(e) {
        if (e.currentTarget.attributes.published && e.currentTarget.attributes.published.value === '1')
            return

        let sel;
        let ser = Object.assign({}, this.state.ser);

        if (e.currentTarget.className.includes('sku')) {
            sel = $('li.series.sku.selected');
        }
        else if (e.currentTarget.className.includes('supp')) {
            sel = $('li.series.supp.selected');
        }
        else if (e.currentTarget.className.includes('disp')) {
            sel = $('li.series.disp.selected');
        }
        else if (e.currentTarget.className.includes('filt')) {
            sel = $('li.series.filt.selected');
        }

        if (sel.length) {

            this.initBricks(e, ser);

            let source;
            if (e.currentTarget.className.includes('sku')) {
                ser.reicoSkuBricks.map((brk, index) => {
                    if (sel.text() === brk.name)
                        source = index;
                })
            }
            else if (e.currentTarget.className.includes('supp')) {
                ser.supplementalDataBricks.map((brk, index) => {
                    if (sel.text() === brk.name)
                        source = index;
                })
            }
            else if (e.currentTarget.className.includes('disp')) {
                ser.displayAttributesBricks.map((brk, index) => {
                    if (sel.text() === brk.name)
                        source = index;
                })
            }
            else if (e.currentTarget.className.includes('filt')) {
                ser.filteredAttributesBricks.map((brk, index) => {
                    if (sel.text() === brk.name)
                        source = index;
                })
            }
 
            if (source === 0) return;

            sel.removeClass('selected');
            sel.prev().addClass('selected');

            let swap;
            const destination = source - 1;
            if (e.currentTarget.className.includes('sku')) {
                swap = ser.reicoSkuBricks[destination];

                ser.reicoSkuBricks[destination] = ser.reicoSkuBricks[source];
                ser.reicoSkuBricks[source] = swap;
            }
            else if (e.currentTarget.className.includes('supp')) {
                swap = ser.supplementalDataBricks[destination];

                ser.supplementalDataBricks[destination] = ser.supplementalDataBricks[source];
                ser.supplementalDataBricks[source] = swap;
            }
            else if (e.currentTarget.className.includes('disp')) {
                swap = ser.displayAttributesBricks[destination];

                ser.displayAttributesBricks[destination] = ser.displayAttributesBricks[source];
                ser.displayAttributesBricks[source] = swap;
            }
            else if (e.currentTarget.className.includes('filt')) {
                swap = ser.filteredAttributesBricks[destination];

                ser.filteredAttributesBricks[destination] = ser.filteredAttributesBricks[source];
                ser.filteredAttributesBricks[source] = swap;
            }

            this.updateBricks(e, ser);
        }
    }
    demote(e) {
        if (e.currentTarget.attributes.published && e.currentTarget.attributes.published.value === '1')
            return

        let sel;
        let ser = Object.assign({}, this.state.ser);

        if (e.currentTarget.className.includes('sku')) {
            sel = $('li.series.sku.selected');
        }
        else if (e.currentTarget.className.includes('supp')) {
            sel = $('li.series.supp.selected');
        }
        else if (e.currentTarget.className.includes('disp')) {
            sel = $('li.series.disp.selected');
        }
        else if (e.currentTarget.className.includes('filt')) {
            sel = $('li.series.filt.selected');
        }

        if (sel.length) {

            this.initBricks(e, ser);

            let source;
            if (e.currentTarget.className.includes('sku')) {
                ser.reicoSkuBricks.map((brk, index) => {
                    if (sel.text() === brk.name)
                        source = index;
                })

                if (source === ser.reicoSkuBricks.length - 1) return;
            }
            else if (e.currentTarget.className.includes('supp')) {
                ser.supplementalDataBricks.map((brk, index) => {
                    if (sel.text() === brk.name)
                        source = index;
                })

                if (source === ser.supplementalDataBricks.length - 1) return;
            }
            else if (e.currentTarget.className.includes('disp')) {
                ser.displayAttributesBricks.map((brk, index) => {
                    if (sel.text() === brk.name)
                        source = index;
                })

                if (source === ser.displayAttributesBricks.length - 1) return;
            }
            else if (e.currentTarget.className.includes('filt')) {
                ser.filteredAttributesBricks.map((brk, index) => {
                    if (sel.text() === brk.name)
                        source = index;
                })

                if (source === ser.filteredAttributesBricks.length - 1) return;
            }

            sel.removeClass('selected');
            sel.next().addClass('selected');

            let swap;
            const destination = source + 1;
            if (e.currentTarget.className.includes('sku')) {
                swap = ser.reicoSkuBricks[destination];

                ser.reicoSkuBricks[destination] = ser.reicoSkuBricks[source];
                ser.reicoSkuBricks[source] = swap;
            }
            else if (e.currentTarget.className.includes('supp')) {
                swap = ser.supplementalDataBricks[destination];

                ser.supplementalDataBricks[destination] = ser.supplementalDataBricks[source];
                ser.supplementalDataBricks[source] = swap;
            }
            else if (e.currentTarget.className.includes('disp')) {
                swap = ser.displayAttributesBricks[destination];

                ser.displayAttributesBricks[destination] = ser.displayAttributesBricks[source];
                ser.displayAttributesBricks[source] = swap;
            }
            else if (e.currentTarget.className.includes('filt')) {
                swap = ser.filteredAttributesBricks[destination];

                ser.filteredAttributesBricks[destination] = ser.filteredAttributesBricks[source];
                ser.filteredAttributesBricks[source] = swap;
            }

            this.updateBricks(e, ser);
        }
    }
    demoteBottom(e) {
        if (e.currentTarget.attributes.published && e.currentTarget.attributes.published.value === '1')
            return

        let sel;
        let ser = Object.assign({}, this.state.ser);

        if (e.currentTarget.className.includes('sku')) {
            sel = $('li.series.sku.selected');
        }
        else if (e.currentTarget.className.includes('supp')) {
            sel = $('li.series.supp.selected');
        }
        else if (e.currentTarget.className.includes('disp')) {
            sel = $('li.series.disp.selected');
        }
        else if (e.currentTarget.className.includes('filt')) {
            sel = $('li.series.filt.selected');
        }

        if (sel.length) {

            this.initBricks(e, ser);

            let source;
            if (e.currentTarget.className.includes('sku')) {
                ser.reicoSkuBricks.map((brk, index) => {
                    if (sel.text() === brk.name)
                        source = index;
                })

                if (source === ser.reicoSkuBricks.length - 1) return;
            }
            else if (e.currentTarget.className.includes('supp')) {
                ser.supplementalDataBricks.map((brk, index) => {
                    if (sel.text() === brk.name)
                        source = index;
                })

                if (source === ser.supplementalDataBricks.length - 1) return;
            }
            else if (e.currentTarget.className.includes('disp')) {
                ser.displayAttributesBricks.map((brk, index) => {
                    if (sel.text() === brk.name)
                        source = index;
                })

                if (source === ser.displayAttributesBricks.length - 1) return;
            }
            else if (e.currentTarget.className.includes('filt')) {
                ser.filteredAttributesBricks.map((brk, index) => {
                    if (sel.text() === brk.name)
                        source = index;
                })

                if (source === ser.filteredAttributesBricks.length - 1) return;
            }

            let swap;
            let destination;

            sel.removeClass('selected');
            if (e.currentTarget.className.includes('sku')) {
                $($('li.series.sku')[ser.reicoSkuBricks.length - 1]).addClass('selected');

                destination = ser.reicoSkuBricks.length - 1;
                swap = ser.reicoSkuBricks[destination];

                ser.reicoSkuBricks[destination] = ser.reicoSkuBricks[source];
                ser.reicoSkuBricks[source] = swap;
            }
            else if (e.currentTarget.className.includes('supp')) {
                $($('li.series.supp')[ser.supplementalDataBricks.length - 1]).addClass('selected');

                destination = ser.supplementalDataBricks.length - 1;
                swap = ser.supplementalDataBricks[destination];

                ser.supplementalDataBricks[destination] = ser.supplementalDataBricks[source];
                ser.supplementalDataBricks[source] = swap;
            }
            else if (e.currentTarget.className.includes('disp')) {
                $($('li.series.disp')[ser.displayAttributesBricks.length - 1]).addClass('selected');

                destination = ser.displayAttributesBricks.length - 1;
                swap = ser.displayAttributesBricks[destination];

                ser.displayAttributesBricks[destination] = ser.displayAttributesBricks[source];
                ser.displayAttributesBricks[source] = swap;
            }
            else if (e.currentTarget.className.includes('filt')) {
                $($('li.series.filt')[ser.filteredAttributesBricks.length - 1]).addClass('selected');

                destination = ser.filteredAttributesBricks.length - 1;
                swap = ser.filteredAttributesBricks[destination];

                ser.filteredAttributesBricks[destination] = ser.filteredAttributesBricks[source];
                ser.filteredAttributesBricks[source] = swap;
            }

            this.updateBricks(e, ser);
        }
    }

    render() {
        return (
            <div className="product-series col-xs-12">
                <CommError error={this.props.ser.error} onClose={this.errorSerClear} />
                <CommError error={this.props.series.error} onClose={this.fetchSerErrorClear} />

                <div className="headWrapper">
                    <div className="productSeries">
                        <h1>Product Series</h1>
                    </div>
                    <div className="button">
                        <button onClick={this.seriesCreate} className="btn btn-primary pull-right">+ Create Series</button>
                    </div>
                </div>
                <div className="tableWrapper">
                    {
                        this.props.series.fetching ?
                            <Spinner name='line-spin-fade-loader' />
                        :
                            null
                    }
                    <table className="lists table table-striped">
                        <thead>
                            <tr className="head">
                                <th>Series Name</th>
                                <th>Last Edited</th>
                                <th>Created By</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.seriesList ? this.props.seriesList.map((series, index) => {
                                    return <tr className="body" key={index}>
                                               <td className="name" ser={series.productSeriesId} onClick={this.seriesEdit}>{series.name}</td>
                                               <td>{series.lastUpdatedAtDisplay}</td>
                                               <td>{series.createdBy}</td>
                                               <td>{series.published === 1 ? "Published" : "Unpublished"}</td>
                                               <td>                          
                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                                       <i className="fa fa-edit" ser={series.productSeriesId} onClick={this.seriesEdit}></i>
                                                    </OverlayTrigger>
                                               </td>
                                           </tr>
                                }) : null
                            }
                        </tbody>
                    </table>
                </div>

                <CreateEditSeries
                    errSer={this.props.ser}
                    errSerClear={this.errorSerClear}

                    bricksList={this.props.bricksList}

                    curSeries={this.props.ser.ser}
                    tmpSeries={this.state.ser}

                    create={this.state.editSeries}
                    isOpen={this.state.editSeriesMode}

                    onAfterOpen={this.afterOpen}
                    onRequestClose={this.updateSeries}
                    onRequestCancel={this.cancelSeries}

                    nameChange={this.nameChange}

                    selSkuBricksDirty={this.state.reicoSkuBricksDirty}
                    selDataBricksDirty={this.state.supplementalDataBricksDirty}
                    selDisplayBricksDirty={this.state.displayAttributesBricksDirty}
                    selFilterBricksDirty={this.state.filteredAttributesBricksDirty}

                    brickSelect={this.brickSelect}

                    selAll={this.selAll}
                    selSel={this.selSel}
                    unSel={this.unSel}
                    unSelAll={this.unSelAll}
                    promoteTop={this.promoteTop}
                    promote={this.promote}
                    demote={this.demote}
                    demoteBottom={this.demoteBottom}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ser: state.ser,
    series: state.series,
    bricksList: state.bricks.bricksSortedList
});

export default connect(mapStateToProps)(ProductSeries)
