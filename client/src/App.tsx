

import * as React from 'react';
import {connect}  from 'react-redux';


import './App.css';
import ToolBar    from './common/components/ToolBar/ToolBar';



const initialState = {
    user: undefined
};

type State = Readonly<typeof initialState>;

class App extends React.Component<{}, State> {

    public readonly state: State = initialState;

    public render() {

        return (
            <div className="App">
                <ToolBar user={user}/>
                <p className="App-intro">
                    To get started, edit <code>src/App.tsx</code> and save to reload.
                </p>
            </div>
        );
    }
}

// const mapStateToProps = () => {
//
// };
//
// const mapDispatchToProps = () => {
//
// };

export default connect()(App);
