const initialState = {
    bricksList: [],
    bricksSortedList: [],
    fetching: false,
    fetched: false,
    error: null
}

export function bricksReducer(state = initialState, action) {

    switch (action.type) {
        case "FETCH_BRICKS_LIST_TOKEN":
        case "FETCH_BRICKS_LIST": {
            return { ...state, fetching: true, fetched: false, error: null }
        }
        case "FETCH_BRICKS_LIST_REJECTED": {
            return { ...state, fetching: false, error: action.payload }
        }
        case "FETCH_BRICKS_LIST_FULFILLED": {
            let sortedBricks = Object.assign([], action.payload.data)

            sortedBricks.sort(function (a, b) {
                if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1
                else if (a.name.toLowerCase() > b.name.toLowerCase())
                    return 1
                else
                    return 0
            })
            
            action.payload.data.map((brick) => {
                var date = new Date(brick.lastUpdatedAt);
                var hours = date.getHours() - 5;
                var minutes = date.getMinutes();
                var ampm = hours >= 12 ? 'pm' : 'am';
                hours = hours % 12;
                hours = hours ? hours : 12;
                minutes = minutes < 10 ? '0' + minutes : minutes;
                var strTime = hours + ':' + minutes + ' ' + ampm;
                brick.lastUpdatedAtDisplay = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
            });

            action.payload.data.sort(function (a, b) {
                var d1 = new Date(a.lastUpdatedAt)
                var d2 = new Date(b.lastUpdatedAt)

                if (d1 > d2)
                    return -1
                else if (d1 < d2)
                    return 1
                else
                    return 0
            })

            return { ...state, fetching: false, fetched: true, bricksList: action.payload.data, bricksSortedList: sortedBricks }
        }
        case "FETCH_BRICK_ERROR": {
            return { ...state, error: null }
        }

        default:
            return state
    }
}
