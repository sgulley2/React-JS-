const initialState = {
    overrides: {},
    fetching: false,
    fetched: false,
    error: null
}

export function webReducer(state = initialState, action) {

    switch (action.type) {

        case "SAVE_PRODUCT_OVERRIDES":
        case "FETCH_PRODUCT_OVERRIDES": {
            return { ...state, fetching: true, fetched: false, error: null }
        }

        case "SAVE_PRODUCT_OVERRIDES_REJECTED":
        case "FETCH_PRODUCT_OVERRIDES_REJECTED": {
            return { ...state, fetching: false, error: action.payload }
        }

        case "SAVE_PRODUCT_OVERRIDES_FULFILLED":
        case "FETCH_PRODUCT_OVERRIDES_FULFILLED": {
            if (action.payload.data.startDate) {
                var date = new Date(action.payload.data.startDate)
                action.payload.data.startDate = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
            }

            if (action.payload.data.endDate) {
                var date = new Date(action.payload.data.endDate)
                action.payload.data.endDate = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
            }

            return { ...state, fetching: false, fetched: true, overrides: action.payload.data }
        }

        default:
            return state
    }
}