import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/TagFaces';
import DownButton from '@material-ui/icons/ArrowDropDownCircle';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SendButton from '@material-ui/icons/Send';
import Avatar from '@material-ui/core/Avatar';
import { ListItem, ListItemText } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import './ChatWindow.css';
// import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'mr-emoji'
import firebase from '../../config/Firebase';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        // height: "50px",
    },
});

class PaperSheet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            containerHeightState: "100%",
            currentMessage: '',
            messages: [],
        }
    }

    toggleDrawer(side, open) {
        this.setState({
            [side]: open,
        });
    };

    opendrawer() {
        this.setState({
            open: true,
            containerHeightState: "60%",
        })
    }

    closeEmojiWindos() {
        this.setState({
            open: false,
            containerHeightState: "100%",
        })
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "instant" });
    }

    handleInput = event => {
        this.setState({
            [event.target.name]: event.target.value,
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
                    containerHeightState: "100%",
                })
            })
        }

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

    enterPressed(event) {
        const code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            //Do stuff in here
            this.sendMessage();
        } 
    }

    printEmoji(e) {
        let emojiPic = String.fromCodePoint(`0x${e.unified}`)
        const { currentMessage } = this.state;
        this.setState({
            currentMessage: currentMessage + emojiPic
        })
    }

    render() {
        const { classes, userAvatar } = this.props;
        const { containerHeightState, messages } = this.state;
        let containerHeight = containerHeightState;

        return (
            <div style={{ height: "80%" }}>
                <div style={{ overflowY: "auto", height: containerHeight }}>
                    {
                        messages.map((value, index) => {
                            if (value.Avatar === userAvatar) {
                                return (
                                    <div key={index} style={{ height: "70px" }}>
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
                                    <div key={index} style={{ height: "70px" }}>
                                        <Paper elevation={4} style={{ float: "left" }}>
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

                {/* Open Emoji Window */}
                {this.state.open && <div>
                    <Picker
                        // onSelect={emoji => this.test(emoji)}
                        onClick={emoji => this.printEmoji(emoji)}
                        set='apple'
                        sheetSize={64}
                        style={{ position: 'absolute', bottom: '86px', width: "55.9%", height: "32%" }}
                        i18n={{ search: 'Search', categories: { search: 'Search Results', recent: 'Recents' } }}
                        showPreview={false}
                    />
                </div>}

                {/* Message Input */}
                <Paper className={classes.root} elevation={1} style={{ position: "absolute", bottom: 5, width: "52%" }}>
                    <div className={classes.margin}>
                        <Grid container spacing={8} alignItems="flex-end">
                            {/* Emoji Button */}
                            <Grid item>
                                {!this.state.open && <AccountCircle onClick={() => this.opendrawer()} style={{ cursor: "pointer" }} />}
                                {this.state.open && <DownButton onClick={() => this.closeEmojiWindos()} style={{ cursor: "pointer" }} />}
                            </Grid>

                            <Grid item>
                                <TextField
                                    id="input-with-icon-grid"
                                    style={{ width: "265%" }}
                                    label="Message"
                                    name="currentMessage"
                                    value={this.state.currentMessage}
                                    onChange={this.handleInput}
                                    onKeyPress={this.enterPressed.bind(this)}
                                    placeholder="Enter a message"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={this.sendMessage}>
                                                    <SendButton />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </Paper>
            </div >
        )
    }
}

export default withStyles(styles)(PaperSheet);
