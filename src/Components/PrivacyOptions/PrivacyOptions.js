import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import firebase from '../../config/Firebase';
import swal from 'sweetalert';
import axios from 'axios';

class ResponsiveDialog extends React.Component {
    state = {
        open: true,
        open2: false,
        avatar: 'https://firebasestorage.googleapis.com/v0/b/meet-up-app-a64cb.appspot.com/o/1540061895779user%20(2).png?alt=media&token=d2b8a384-eddb-42a2-9f13-d8f4b1b65d1d',
        checkedA: true,
        checkedB: true,
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
        this.props.closePrivacyOptions();
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleClickOpen2 = () => {
        this.setState({ open2: true });
    };

    handleClose2 = () => {
        this.setState({ open2: false });
    };

    checkUser() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {

            } else {
                swal("Logged Out");
                this.props.loginUser();
            }
        });
    }

    logoutUser = () => {
        try {
            firebase.auth().signOut();
            this.checkUser();
        } catch (error) {
            swal("" + error);
        }
    }

    handleInputButton = () => {
        this.inputElement.click();
    }

    fileSelectHandler = event => {
        this.savePictureToDB(event.target.files[0]);
    }

    savePictureToDB = pic => {
        console.log(pic);
        let fd = new FormData();
        const date = Date.now();

        fd.append('image', pic, date + pic.name);

        axios.post('https://us-central1-meet-up-app-a64cb.cloudfunctions.net/uploadImage', fd, {
            onUploadProgress: progressEvent => {
                console.log('Upload Progess: ' + Math.round(progressEvent.loaded / progressEvent.total * 100) + '%');
            }
        }).then((res) => {
            // this.setThumbnail(res.data.link)
            console.log(res.data.link);
            const userRef = firebase.database().ref(firebase.auth().currentUser.uid).child("User Info");
            userRef.update({
                CurrentPhoto: res.data.link,
            })
        })
    }

    componentWillMount() {
        this.getProfilePic();
    }

    getProfilePic = () => {
        const userRef = firebase.database().ref(firebase.auth().currentUser.uid).child("User Info");

        userRef.on('value', snap => {
            this.setState({
                avatar: snap.val().CurrentPhoto
            })
        })
    }

    

    renderConfirmation() {
        return (
            <div>
                <Dialog
                    open={this.state.open2}
                    onClose={this.handleClose2}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">ARE YOU SURE YOU WANT TO DELETE YOUR ACCOUNT?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Once deleted the account can nver be recovered through any means. This is a one time process. Are you sure you want to delete your account?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose2} variant="contained" color="primary" autoFocus>
                            Cancel
                  </Button>
                        <Button onClick={this.handleClose2} variant="contained" color="secondary">
                            Delete
                  </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    render() {
        const { fullScreen } = this.props;
        const { avatar } = this.state;

        return (
            <div>
                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title" >
                    <DialogTitle style={{ backgroundColor: "#00A86B" }} id="responsive-dialog-title">Privacy Options</DialogTitle>
                    <DialogContent style={{ backgroundColor: "#00A86B" }}>
                        <DialogContentText>
                            <Avatar
                                style={{
                                    height: "256px",
                                    width: "256px",
                                }}
                                alt="??"
                                src={avatar}
                            />
                            <br />
                            <input
                                ref={input => this.inputElement = input}
                                accept="image/*"
                                style={{ display: "none" }}
                                id="flat-button-file"
                                multiple
                                type="file"
                                onChange={this.fileSelectHandler}
                            />
                            <Button style={{ float: "right" }} onClick={this.handleInputButton} variant="contained" color="primary">Change Profile Picture</Button>
                            <br />
                            <br />
                            <br />
                            <Divider inset style={{ backgroundColor: "#b7b7b7" }} />
                            <br />
                            <Typography variant="subheading">
                                Display profile pic to others?
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={this.state.checkedA}
                                                onChange={this.handleChange('checkedA')}
                                                value="checkedA"
                                            />
                                        }
                                        label={this.state.checkedA ? "Picture Visible" : "Picutre Hidden"}
                                    />
                                </FormGroup>
                            </Typography>
                            <br />
                            <Typography variant="display1">
                                Account Actions:
                                <br />
                                <br />
                                <Button onClick={this.logoutUser} variant="contained" color="primary">
                                    Logout
                                    <Icon>logout</Icon>

                                </Button>
                                {this.state.open2 && this.renderConfirmation()}
                                <Button onClick={this.handleClickOpen2} style={{ marginLeft: "15px" }} variant="contained" color="secondary" >
                                    Delete Account
                                    <DeleteIcon />
                                </Button>
                            </Typography>
                            <br />
                            <Divider inset style={{ backgroundColor: "#b7b7b7" }} />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="contained" color="default" autoFocus>
                            CLOSE
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

ResponsiveDialog.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(ResponsiveDialog);