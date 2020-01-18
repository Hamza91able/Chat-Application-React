import React from 'react';
import PropTypes from 'prop-types';
import ChatWindow from '../ChatWindow/ChatWindow'
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import MailFolderListItems from './chatData';
import SimpleBottomNavigation from './tileData';
import Avatar from '@material-ui/core/Avatar';
import { ListItem, ListItemText } from '@material-ui/core';
import background from './images/background/background.png';
import {
    isMobile
} from "react-device-detect";
import ChatWindowMobile from '../../Mobile/ChatWindowMobile/ChatWindowMobile';

// const drawerWidth = 445;
const drawerWidth = 520;

const styles = theme => ({
    root: {
        flexGrow: 1,
        // height:"100vh"
    },
    appFrame: {
        // height: "800px",
        height: "90vh",
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%'
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
    },
    'appBar-left': {
        marginLeft: drawerWidth,
    },
    'appBar-right': {
        marginRight: drawerWidth,
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
    drawerPaperMobile: {
        position: 'relative',
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
});

class ChatHub extends React.Component {
    state = {
        anchor: 'left',
        selectedUserName: '',
        selectedUserNameAvatar: '',
        showMobileChatHub: true,
        showMobileChats: false,
    };

    handleChange = event => {
        this.setState({
            anchor: event.target.value,
        });
    };

    setSelectedUserName = (name, avatar, lastSeen, UID) => {
        this.setState({
            selectedUserName: '',
        })
        setTimeout(() => {
            this.setState({
                selectedUserName: name,
                selectedUserNameAvatar: avatar,
                lastSeen: lastSeen,
                selectedUserUID: UID,
            })
        }, 100);
    }

    getChats(chats) {
        this.setState({
            chats: chats
        })
    }

    showChats(UID) {
        this.setState({
            showMobileChatHub: false,
            showMobileChats: true,
            selectedUserUID: UID,
        })
    }

    hideChats() {
        this.setState({
            showMobileChatHub: true,
            showMobileChats: false,
        })
    }

    render() {
        const { classes } = this.props;
        const { anchor, selectedUserName, selectedUserNameAvatar, lastSeen, showMobileChatHub, showMobileChats, selectedUserUID } = this.state;

        // Side drawer to show Contacts
        const drawer = (
            <Drawer
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }} >
                <SimpleBottomNavigation />
                <Divider />
                <List>
                    {<MailFolderListItems getChats={this.getChats.bind(this)} setSelectedUserName={this.setSelectedUserName.bind(this)} />}</List>
            </Drawer>
        );

        let before = null;

        // Set position of drawer
        if (anchor === 'left') {
            before = drawer;
        }

        if (isMobile) {
            return (
                <div style={{ width: "100%",height:"100%" }}>
                    {showMobileChatHub && <Drawer
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaperMobile,
                        }} >
                        <SimpleBottomNavigation />
                        <List>{<MailFolderListItems hideHeaderBar={this.props.hideHeaderBar} showChats={this.showChats.bind(this)} getChats={this.getChats.bind(this)} setSelectedUserName={this.setSelectedUserName.bind(this)} />}</List>
                    </Drawer>}
                    {showMobileChats && <ChatWindowMobile selectedUserUID={selectedUserUID} lastSeen={lastSeen} showHeaderBar={this.props.showHeaderBar} hideChats={this.hideChats.bind(this)} selectedUserName={selectedUserName} userAvatar={this.props.userAvatar} chats={this.state.chats} selectedUserNameAvatar={selectedUserNameAvatar} />}
                </div>
            )
        }
        else {
            // Render Selected User Bar
            return (
                <div className={classes.root}>
                    <div className={classes.appFrame} >
                        <AppBar
                            position="absolute"
                            className={classNames(classes.appBar, classes[`appBar-${anchor}`])} >
                            <Toolbar>
                                <Typography variant="title" color="inherit" noWrap>
                                    <ListItem>
                                        <Avatar
                                            alt="Adelle Charles"
                                            src={selectedUserNameAvatar} />
                                        <ListItemText>
                                            <Typography style={{ color: "#efefef" }} variant="inherit">
                                                {selectedUserName}
                                            </Typography>
                                            <Typography style={{ color: "#efefef" }} variant="caption">
                                                {selectedUserName !== "" && "Last Seen: " + lastSeen}
                                            </Typography>
                                        </ListItemText>
                                    </ListItem>
                                </Typography>
                            </Toolbar>
                        </AppBar>

                        {before}
                        <main style={{ backgroundImage: `url(${background})` }} className={classes.content}>
                            <div className={classes.toolbar} />
                            {selectedUserName !== "" && <ChatWindow ref={instance => { this.test = instance; }} selectedUserUID={selectedUserUID} userAvatar={this.props.userAvatar} chats={this.state.chats} selectedUserNameAvatar={selectedUserNameAvatar} />}
                            {/* {selectedUserName !== "" &&  <ChatWindowMobile selectedUserUID={selectedUserUID} lastSeen={lastSeen} showHeaderBar={this.props.showHeaderBar} hideChats={this.hideChats.bind(this)} selectedUserName={selectedUserName} userAvatar={this.props.userAvatar} chats={this.state.chats} selectedUserNameAvatar={selectedUserNameAvatar} />} */}
                        </main>
                    </div>
                </div >
            );
        }
    }
}

ChatHub.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatHub);