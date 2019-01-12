const initialState = {
    product: {},
    fetching: false,
    fetched: false,
    error: null
}

export function productReducer(state = initialState, action) {

    switch (action.type) {

        case "FETCH_PRODUCT": {
            return { ...state, fetching: true, fetched: false, error: null }
        }

        case "FETCH_PRODUCT_REJECTED": {
            return { ...state, fetching: false, error: action.payload }
        }

        case "FETCH_PRODUCT_FULFILLED": {
            if (action.payload.data.startDate) {
                var date = new Date(action.payload.data.startDate)
                action.payload.data.startDate = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
            }

            if (action.payload.data.endDate) {
                var date = new Date(action.payload.data.endDate)
                action.payload.data.endDate = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
            }

            return { ...state, fetching: false, fetched: true, product: action.payload.data }
        }

        default:
            return state
    }
}