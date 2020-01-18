import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import BackBtn from '@material-ui/icons/ArrowBack';
import Avatar from '@material-ui/core/Avatar';
import { ListItem, ListItemText } from '@material-ui/core';
import VertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/TagFaces';
import DownButton from '@material-ui/icons/ArrowDropDownCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import SendButton from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';
import background from './images/background/background.png';
import './ChatWindowMobile.css'
import 'emoji-mart/css/emoji-mart.css'
import firebase from '../../config/Firebase';
import AwesomeDebouncePromise from 'awesome-debounce-promise';


const searchAPI = text => fetch('/search?text=' + encodeURIComponent(text));
const searchAPIDebounced = AwesomeDebouncePromise(searchAPI, 500);

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: -20,
    },
};

class ChatWindowMobile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            containerHeightState: "80vh",
            currentMessage: '',
            messages: [],
        }
    }

    goBack() {
        this.props.hideChats();
        this.props.showHeaderBar();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }


    opendrawer() {
        this.setState({
            open: true,
            containerHeightState: "40vh",
        })
    }

    closeEmojiWindos() {
        this.setState({
            open: false,
            containerHeightState: "80vh",
        })
    }

    AdjustHeight() {
        this.setState({
            containerHeightState: "230px",
        })
    }

    PerviousHeight() {
        this.setState({
            containerHeightState: "80vh",
        })
    }

    sendMessage = () => {

        const { currentMessage } = this.state;
        const { selectedUserUID, userAvatar } = this.props;
        const d = new Date();
        const datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " +
            d.getHours() + ":" + d.getMinutes();
        const userAuth = firebase.auth().currentUser.uid;
        const senMsgRef = firebase.database().ref(userAuth).child("User Info").child("Contacts").child(selectedUserUID).child("Messages");
        const senUserRef = firebase.database().ref(userAuth).child("User Info").child("Contacts").child(selectedUserUID);
        const recMsgRef = firebase.database().ref(selectedUserUID).child("User Info").child("Contacts").child(userAuth).child("Messages");
        const recUserRef = firebase.database().ref(selectedUserUID).child("User Info").child("Contacts").child(userAuth);

        if (currentMessage !== '') {

            senMsgRef.push({
                Message: currentMessage,
                RecieverID: selectedUserUID,
                SenderID: userAuth,
                Time: datestring,
                Avatar: userAvatar,
            }).then(() => {
                senUserRef.update({
                    LastMessage: currentMessage,
                })
            })

            recMsgRef.push({
                Message: currentMessage,
                RecieverID: userAuth,
                SenderID: selectedUserUID,
                Time: datestring,
                Avatar: userAvatar,
            }).then(() => {
                recUserRef.update({
                    LastMessage: currentMessage,
                })
            }).then(() => {
                this.setState({
                    currentMessage: '',
                    open: false,
                    containerHeightState: "80vh",
                })

            })
        }
        console.log(this.input)
    }

    retrieveMessages = () => {
        const { selectedUserUID } = this.props;
        const userAuth = firebase.auth().currentUser.uid;
        const msgRef = firebase.database().ref(userAuth).child("User Info").child("Contacts").child(selectedUserUID).child("Messages");

        msgRef.on('child_added', snap => {
            let snapVal = snap.val();
            this.setState(prevState => ({
                messages: [...prevState.messages, snapVal]
            }))
        })
    }

    getNewMsgs = () => {
        this.setState({
            messages: [],
        })
        this.retrieveMessages();
    }

    componentDidMount() {
        this.retrieveMessages();
        this.scrollToBottom();
    }

    componentWillUnmount() {
        this.setState({
            messages: [],
        })
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "instant" });
    }

    handleInput = async event => {
        let currentMessage = event.target.value;
        const result = await searchAPIDebounced(currentMessage);

        this.setState({ currentMessage, result, });
    }

    renderUserBar() {
        const { classes, selectedUserName, selectedUserNameAvatar, lastSeen } = this.props;

        return (
            <div style={{ marginBottom: "8px" }} className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton onClick={this.goBack.bind(this)} className={classes.menuButton} color="inherit" aria-label="Menu">
                            <BackBtn onClick={this.goBack.bind(this)} />
                        </IconButton>
                        <ListItem>
                            <Avatar
                                onClick={this.goBack.bind(this)}
                                alt="??"
                                src={selectedUserNameAvatar} />
                            <ListItemText>
                                <Typography style={{ color: "#efefef" }} variant="inherit">
                                    {selectedUserName}
                                </Typography>
                                <Typography style={{ color: "#efefef" }} variant="caption">
                                    {"Last Seen: " + lastSeen}
                                </Typography>
                            </ListItemText>
                        </ListItem>
                        <Button
                            onClick={this.handleProfileMenuOpen}
                            color="inherit">
                            <VertIcon />
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }

    renderMsgs() {
        const { userAvatar } = this.props;
        const { containerHeightState, messages } = this.state;
        let containerHeight = containerHeightState;

        return (
            <div style={{ height: "80%" }}>
                <div style={{ overflowY: "auto", height: containerHeight }}>
                    {
                        messages.map((value, index) => {
                            if (value.Avatar === userAvatar) {
                                return (
                                    <div key={index} style={{ height: "80px", marginRight: "5px" }}>
                                        <Paper elevation={4} style={{ float: "right" }}>
                                            <Typography variant="inherit">
                                                <ListItem>
                                                    <ListItemText>
                                                        <Typography variant="inherit">
                                                            {value.Message}
                                                        </Typography>
                                                        <Typography variant="caption">
                                                            {value.Time}
                                                        </Typography>
                                                    </ListItemText>
                                                    <Avatar
                                                        alt="Adelle Charles"
                                                        src={value.Avatar} />
                                                </ListItem>
                                            </Typography>
                                        </Paper>
                                        <br />
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div key={index} style={{ height: "80px" }}>
                                        <Paper elevation={4} style={{ float: "left", marginLeft: "5px" }}>
                                            <Typography variant="inherit">
                                                <ListItem>
                                                    <ListItemText>
                                                        <Typography variant="inherit">
                                                            {value.Message}
                                                        </Typography>
                                                        <Typography variant="caption">
                                                            {value.Time}
                                                        </Typography>
                                                    </ListItemText>
                                                    <Avatar
                                                        alt="Adelle Charles"
                                                        src={value.Avatar} />
                                                </ListItem>
                                            </Typography>
                                        </Paper>
                                        <br />
                                    </div>
                                )
                            }
                        })
                    }

                    {/* Empty Div used for scrolling to bottom. */}
                    <div style={{ float: "left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>

                </div>

                {/* Input Message Field */}
                <Paper elevation={1} style={{
                    position: "fixed",
                    bottom: 5,
                    height: "60px",
                    width: "100%",
                }}>
                    <div style={{ width: "100%" }}>
                        <Grid container spacing={8} alignItems="flex-end">
                            {/* Emoji Button */}
                            <Grid item>
                                {!this.state.open && <AccountCircle onClick={() => this.opendrawer()} style={{ cursor: "pointer", marginLeft: "10px", height: "30px", width: "30px" }} />}
                                {this.state.open && <DownButton onClick={() => this.closeEmojiWindos()} style={{ cursor: "pointer", marginLeft: "10px", height: "30px", width: "30px" }} />}
                            </Grid>

                            <Grid style={{ width: "80%", float: "right", display: 'inline' }} item>
                                <TextField
                                    id="input-with-icon-grid"
                                    style={{ width: "100%" }}
                                    label="Message"
                                    ref={ref => this.input = ref}
                                    name="currentMessage"
                                    // value={this.state.currentMessage}
                                    onChange={this.handleInput}
                                    placeholder="Enter a message"
                                    onTouchStart={this.AdjustHeight.bind(this)}
                                    onBlur={this.PerviousHeight.bind(this)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={this.sendMessage}><SendButton /></IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </Paper>
            </div>
        )
    }

    render() {
        console.log(this.state.currentMessage)
        return (
            <div style={{ backgroundImage: `url(${background})` }}>
                {this.renderUserBar()}
                {this.renderMsgs()}
            </div>
        );
    }
}

ChatWindowMobile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatWindowMobile);
