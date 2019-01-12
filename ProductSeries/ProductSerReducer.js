const initialState = {
    ser: {
        name: '',
        notes: '',
        published: '0',
        reicoSkuBricks: [],
        supplementalDataBricks: [],
        displayAttributesBricks: [],
        filteredAttributesBricks: [],
        productSeriesId: '',
    },
    updating: false,
    updated: false,
    error: null
}

export function serReducer(state = initialState, action) {

    switch (action.type) {

        case "CREATE_SERIES":
        case "FETCH_SERIES":
        case "UPDATE_SERIES": {
            return { ...state, updating: true, updated: false, error: null }
        }

        case "CREATE_SERIES_REJECTED":
        case "FETCH_SERIES_REJECTED":
        case "UPDATE_SERIES_REJECTED": {
            return { ...state, updating: false, error: action.payload }
        }

        case "CREATE_SERIES_FULFILLED":
        case "FETCH_SERIES_FULFILLED":
        case "UPDATE_SERIES_FULFILLED": {
            action.payload.data.supplementalDataBricks.sort(function (a, b) {
                if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1
                else if (a.name.toLowerCase() > b.name.toLowerCase())
                    return 1
                else
                    return 0
            })

            action.payload.data.displayAttributesBricks.sort(function (a, b) {
                if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1
                else if (a.name.toLowerCase() > b.name.toLowerCase())
                    return 1
                else
                    return 0
            })

            action.payload.data.filteredAttributesBricks.sort(function (a, b) {
                if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1
                else if (a.name.toLowerCase() > b.name.toLowerCase())
                    return 1
                else
                    return 0
            })

            return { ...state, updating: false, updated: true, ser: action.payload.data }
        }

        case "SER_ERROR": {
            return { ...state, error: null }
        }

        default:
            return state
    }
}