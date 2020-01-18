import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ChatIcon from '@material-ui/icons/Chat';
import { Typography } from '@material-ui/core';
import {
    isMobile
} from "react-device-detect";
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';

export default class SimpleBottomNavigation extends React.Component {
    state = {
        value: 0,
    };

    render() {
        const { value } = this.state;

        if (isMobile) {
            return (
                <List style={{ backgroundColor: "#3f51b5" }}>
                    <ListItemText><Button style={{ color: "#fff" }}>Chats</Button></ListItemText>
                </List>
            )
        }
        else {
            return (
                <BottomNavigation style={{ backgroundColor: "#3f51b5" }} value={value} showLabels>
                    <BottomNavigationAction style={{ color: "#fff" }} label={
                        <Typography color="inherit" variant="subheading">
                            Chats
                        </Typography>
                    } icon={<ChatIcon />} />
                </BottomNavigation>
            );
        }
        //AppBar used on top of Contacts

    }
}