import {Action} from 'redux';



const initialState = {};
export type State = typeof initialState;

const appReducer = (state: State = {}, action: Action): State => {
    switch (action.type) {

        default:
            return state;
    }
};


export default {
    app: appReducer
}

