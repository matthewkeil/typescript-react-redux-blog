
import * as React from 'react';
import {SFC}      from 'react';

import IconButton from '@material-ui/core/IconButton';
import AppBar   from '@material-ui/core/AppBar';
import Toolbar  from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

import './ToolBar.css';

export type ToolBarProps = {
    user?: any;
};

const ToolBar: SFC<ToolBarProps> = ({user}: ToolBarProps) => (
    <AppBar>
        <Toolbar>
            <span>Curls.Coffee</span>
            <span></span>
            <IconButton>
                {user
                    ? <MenuIcon />
                    : <AccountCircle />}
            </IconButton>
        </Toolbar>
    </AppBar>
);


export default ToolBar;