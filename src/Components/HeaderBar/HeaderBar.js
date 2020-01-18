import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import PrivacyOptions from '../PrivacyOptions/PrivacyOptions';
import {
    isMobile
} from "react-device-detect";
import VertIcon from '@material-ui/icons/MoreVert';
import firebase from "../../config/Firebase";
import swal from 'sweetalert';
import { Divider } from '@material-ui/core';
import { ListItem, ListItemText } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Add';

const styles = theme => ({
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    title: {
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        display: "none",
        [theme.breakpoints.up('sm')]: {
            display: "block",
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginRight: theme.spacing.unit * 2,
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing.unit * 3,
                width: 'auto',
            },
        },

    },
    searchIcon: {
        display: "none",
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    sectionDesktop: {
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
});

class PrimarySearchAppBar extends React.Component {
    state = {
        anchorEl: null,
        mobileMoreAnchorEl: null,
        pic: '',
        picAlt: 'https://firebasestorage.googleapis.com/v0/b/meet-up-app-a64cb.appspot.com/o/1540061895779user%20(2).png?alt=media&token=d2b8a384-eddb-42a2-9f13-d8f4b1b65d1d',
        openEmail: false,
        openPhone: false,
        anchorEl2: null,
        showPrivacyOptions: false,
        userName: '',
        emailToSearch: '',
        searchedCurrentPhoto: '',
        searchedEmail: '',
        searchedFirstName: '',
        searchedSecondName: '',
        searchedPhoneNo: '',
        display: "none",
    };

    handleProfileMenuOpen = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuClose = () => {
        this.setState({ anchorEl: null });
    };

    handleClickOpen = () => {
        this.setState({ openEmail: true });
    };

    handleClose = () => {
        this.setState({
            openEmail: false, emailToSearch: '',
            searchedCurrentPhoto: '',
            searchedEmail: '',
            searchedFirstName: '',
            searchedSecondName: '',
            searchedPhoneNo: '',
            searchedUID: '',
            display: "none",
        });
    };

    handleClickOpen2 = () => {
        this.setState({ openPhone: true });
    };

    handleClose2 = () => {
        this.setState({ openPhone: false });
    };

    handleClick = event => {
        this.setState({ anchorEl2: event.currentTarget });
    };

    handleCloseMenu = () => {
        this.setState({ anchorEl2: null });
    };

    openPrivacyOptions = () => {
        this.setState({ showPrivacyOptions: true })
    }

    closePrivacyOptions = () => {
        this.setState({ showPrivacyOptions: false })
    }

    getFirstName = () => {
        const userRef = firebase.database().ref(firebase.auth().currentUser.uid).child("User Info");

        userRef.on('value', snap => {
            this.setState({
                userName: snap.val().FirstName,
                pic: snap.val().CurrentPhoto,
            })
            this.props.setAvatar(snap.val().CurrentPhoto);
        })
    }

    componentDidUpdate() {

    }

    getContactWithEmail = () => {
        const userRef = firebase.database().ref();
        userRef.once('value', snap => {
            snap.forEach(snap2 => {
                snap2.forEach(snap3 => {
                    const userEmail = firebase.auth().currentUser.email;
                    if (snap3.val().Email === this.state.emailToSearch) {
                        if (snap3.val().Email !== userEmail) {
                            this.setState({
                                searchedCurrentPhoto: snap3.val().CurrentPhoto,
                                searchedEmail: snap3.val().Email,
                                searchedFirstName: snap3.val().FirstName,
                                searchedSecondName: snap3.val().SecondName,
                                searchedPhoneNo: snap3.val().PhoneNo,
                                searchedUID: snap3.val().UID,
                                display: "inline"
                            })
                        }
                        else {
                            swal("You can't add your self");
                        }
                    }
                    setTimeout(() => {
                        if (this.state.emailToSearch !== this.state.searchedEmail) {
                            swal("User Not Found");
                        }
                    }, 100);

                })
            })
        })
    }

    addContactWithEmail = () => {
        const { searchedEmail, searchedUID, searchedCurrentPhoto, searchedFirstName, searchedSecondName } = this.state;
        let currentUserPhoto = '', currentUserFirstName = '', currentUserSecondName = '';
        const fbAuth = firebase.auth().currentUser;
        const userRef = firebase.database().ref(fbAuth.uid).child("User Info").child("Contacts").child(searchedUID);
        const searchedUserRef = firebase.database().ref(searchedUID).child("User Info").child("Contacts").child(firebase.auth().currentUser.uid);
        const currentUserRef = firebase.database().ref(fbAuth.uid).child("User Info");

        userRef.update({
            Email: searchedEmail,
            UID: searchedUID,
            currentPhoto: searchedCurrentPhoto,
            FirstName: searchedFirstName,
            SecondName: searchedSecondName,
        })

        currentUserRef.once('value', snap => {
            currentUserPhoto = snap.val().CurrentPhoto;
            currentUserFirstName = snap.val().FirstName;
            currentUserSecondName = snap.val().SecondName;
            searchedUserRef.update({
                Email: fbAuth.email,
                UID: fbAuth.uid,
                currentPhoto: currentUserPhoto,
                FirstName: currentUserFirstName,
                SecondName: currentUserSecondName,
            })
        })

        swal("User Added");
        this.handleClose();
    }

    handleFile = event => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    componentDidMount() {
        this.getFirstName();
    }

    renderAddContactMenu() {
        const { anchorEl2 } = this.state;
        return (
            <Menu
                id="simple-menu"
                anchorEl={anchorEl2}
                open={Boolean(anchorEl2)}
                onClose={this.handleCloseMenu} >

                <MenuItem onClick={this.handleClickOpen2}>With Number</MenuItem>
                <MenuItem onClick={this.handleClickOpen}>With Email Address</MenuItem>
            </Menu>
        )
    }

    renderAddWithEmail() {
        const { display, searchedEmail, searchedCurrentPhoto, searchedFirstName, searchedSecondName } = this.state;

        return (
            <div>
                <Dialog
                    open={this.state.openEmail}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add New Contacts</DialogTitle>
                    <DialogContent>
                        <DialogContentText style={{ width: "550px" }}>
                            <Typography variant="subheading">
                                With Email Address:
                        </Typography>
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            name="emailToSearch"
                            value={this.state.emailToSearch}
                            onChange={this.handleFile}
                            fullWidth
                        />

                        <div style={{ display: display }}>
                            <br />
                            <br />
                            <Divider inset />
                            <br />
                            <Paper elevation={4} style={{ float: "left" }}>
                                <Typography variant="inherit">
                                    <ListItem>
                                        <Avatar
                                            alt="Adelle Charles"
                                            src={searchedCurrentPhoto} />
                                        <ListItemText>
                                            <Typography variant="inherit">
                                                {searchedFirstName + " " + searchedSecondName}
                                            </Typography>
                                            <Typography variant="caption">
                                                {searchedEmail}
                                            </Typography>
                                        </ListItemText>
                                        <IconButton onClick={this.addContactWithEmail} aria-label="Delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItem>
                                </Typography>
                            </Paper>
                        </div>


                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                    </Button>
                        <Button onClick={this.getContactWithEmail} color="primary">
                            Add
                    </Button>
                    </DialogActions>
                </Dialog>
                {this.state.showPrivacyOptions && <PrivacyOptions loginUser={this.props.loginUser} closePrivacyOptions={this.closePrivacyOptions.bind(this)} />}
            </div>
        )
    }

    renderAddWithNumber() {
        return (
            <Dialog
                open={this.state.openPhone}
                onClose={this.handleClose2}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add New Contacts</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ width: "550px" }}>
                        <Typography variant="subheading">
                            With Number:
                        </Typography>
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="number"
                        label="Number"
                        type="number"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose2} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleClose2} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }


    render() {
        const { anchorEl, userName } = this.state;
        const { classes } = this.props;
        const isMenuOpen = Boolean(anchorEl);

        const renderMenu = (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={this.handleMenuClose}
            >
                <MenuItem onClick={this.openPrivacyOptions}>Privacy Options</MenuItem>
                <MenuItem onClick={this.handleClick}>Add Contacts</MenuItem>
            </Menu>
        );

        if (isMobile) {
            return (
                <div className={classes.root}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" color="inherit" className={classes.grow}>
                                Chat Application
                                </Typography>
                            <Button
                                onClick={this.handleProfileMenuOpen}
                                color="inherit"><VertIcon />
                            </Button>
                        </Toolbar>
                    </AppBar>
                    {renderMenu}
                    {this.renderAddWithEmail()}
                    {this.renderAddWithNumber()}
                    {this.renderAddContactMenu()}
                </div>
            )
        }
        else {
            return (
                <div className={classes.root}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography className={classes.title} variant="title" color="inherit" noWrap>
                                Chat Application
                            </Typography>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <Input
                                    placeholder="Search…"
                                    disableUnderline
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                />
                            </div>
                            <div className={classes.grow} />
                            <div className={classes.sectionDesktop}>

                                <IconButton
                                    aria-owns={isMenuOpen ? 'material-appbar' : null}
                                    aria-haspopup="true"
                                    onClick={this.handleProfileMenuOpen}
                                    color="inherit">

                                    <Avatar
                                        style={{
                                            height: "50px",
                                            width: "50px",
                                        }}
                                        alt="???"
                                        src={this.state.pic} />
                                    <Typography style={{ marginLeft: "5px" }} color="inherit" variant="subheading">
                                        {/* Get User Name From Firebase */}
                                        {userName}
                                    </Typography>
                                </IconButton>
                            </div>
                        </Toolbar>
                    </AppBar>
                    {renderMenu}
                    {this.renderAddWithEmail()}
                    {this.renderAddWithNumber()}
                    {this.renderAddContactMenu()}
                </div>
            );
        }

    }
}

PrimarySearchAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PrimarySearchAppBar);