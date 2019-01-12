const initialState = {
    brick: {
        name: '',
        length: 0,
        example: '',
        sourceField: '',
        productBrickId: '',
        values: []
    },
    updating: false,
    updated: false,
    error: null
}

export function brickReducer(state = initialState, action) {

    switch (action.type) {

        case "CREATE_BRICK":
        case "FETCH_BRICK":
        case "UPDATE_BRICK": {
            return { ...state, updating: true, updated: false, error: null }
        }

        case "CREATE_BRICK_REJECTED":
        case "FETCH_BRICK_REJECTED":
        case "UPDATE_BRICK_REJECTED": {
            return { ...state, updating: false, error: action.payload }
        }

        case "CREATE_BRICK_FULFILLED":
        case "FETCH_BRICK_FULFILLED":
        case "UPDATE_BRICK_FULFILLED":
        case "UPDATE_BRICK_VALUES_FULFILLED" : {
            return { ...state, updating: false, updated: true, brick: action.payload.data }
        }

        case "BRICK_ERROR": {
            return { ...state, error: null }
        }

        default:
            return state
    }
}