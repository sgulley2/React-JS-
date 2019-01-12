const initialState = {
    seriesList: [],
    seriesSortedList: [],
    fetching: false,
    fetched: false,
    error: null
}

export function seriesReducer(state = initialState, action) {

    switch (action.type) {
        case "FETCH_SERIES_LIST_TOKEN":
        case "FETCH_SERIES_LIST": {
            return { ...state, fetching: true, fetched: false, error: null }
        }
        case "FETCH_SERIES_LIST_REJECTED": {
            return { ...state, fetching: false, error: action.payload }
        }
        case "FETCH_SERIES_LIST_FULFILLED": {
            let sortedSeries = Object.assign([], action.payload.data)

            sortedSeries.sort(function (a, b) {
                if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1
                else if (a.name.toLowerCase() > b.name.toLowerCase())
                    return 1
                else
                    return 0
            })

            action.payload.data.map((ser) => {
                var date = new Date(ser.lastUpdatedAt);
                var hours = date.getHours() - 5;
                var minutes = date.getMinutes();
                var ampm = hours >= 12 ? 'pm' : 'am';
                hours = hours % 12;
                hours = hours ? hours : 12;
                minutes = minutes < 10 ? '0' + minutes : minutes;
                var strTime = hours + ':' + minutes + ' ' + ampm;
                ser.lastUpdatedAtDisplay = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
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

            return { ...state, fetching: false, fetched: true, seriesList: action.payload.data, seriesSortedList: sortedSeries }
        }
        case "FETCH_SER_ERROR": {
            return { ...state, error: null }
        }

        default:
            return state
    }
}