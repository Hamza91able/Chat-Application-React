import React, { Component } from 'react';
import './Register.css';
import { TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import firebase from '../../config/Firebase';
import swal from 'sweetalert';

class Register extends Component {
    state = {
        amount: '',
        firstName: '',
        secondName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNo: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    };

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleClickShowPassword = () => {
        this.setState(state => ({ showPassword: !state.showPassword }));
    };

    handleInput = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    registerUser = () => {
        const { email, password, confirmPassword, phoneNo, firstName, secondName } = this.state;

        if (password === confirmPassword && phoneNo.length === 11 && firstName !== "" && secondName !== "") {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    swal("Created Successfully");
                    this.props.hideRegister();
                    const userRef = firebase.database().ref(firebase.auth().currentUser.uid).child("User Info");
                    userRef.set({
                        PhoneNo: phoneNo,
                        FirstName: firstName,
                        SecondName: secondName,
                        Email: email,
                        UID: firebase.auth().currentUser.uid,
                    })
                }).catch(error => {
                    // Handle Errors here.
                    swal(" " + error);
                    // ...
                });
        }
        else {
            if (password !== confirmPassword) {
                swal("Passwords didn't match");
            }
            if (phoneNo.length !== 11) {
                swal("Enter a correct phone number")
            }
            if (firstName === "" && secondName === "") {
                swal("Enter Name");
            }
        }
    }

    renderRegister() {
        return (
            <Card>
                <CardContent>
                    <Typography variant="title" component="h2">
                        REGISTER:
                        </Typography>

                    <TextField style={{ width: "260px" }}
                        id="filled-email-input"
                        label="Email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        margin="normal"
                        variant="filled"
                        value={this.state.email}
                        onChange={this.handleInput}
                    />

                    <TextField style={{ width: "260px", marginTop: "2px" }}
                        id="filled-name-firstName"
                        label="First Name"
                        type="text"
                        name="firstName"
                        autoComplete="name"
                        margin="normal"
                        variant="filled"
                        value={this.state.firstName}
                        onChange={this.handleInput}
                    />

                    <TextField style={{ width: "260px", marginTop: "2px" }}
                        id="filled-name-secondName"
                        label="Second Name"
                        type="text"
                        name="secondName"
                        autoComplete="name"
                        margin="normal"
                        variant="filled"
                        value={this.state.secondName}
                        onChange={this.handleInput}
                    />

                    <TextField style={{ width: "260px", marginTop: "2px" }}
                        id="filled-adornment-password"
                        variant="filled"
                        type={this.state.showPassword ? 'text' : 'password'}
                        label="Password"
                        value={this.state.password}
                        onChange={this.handleChange('password')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment variant="filled" position="end">
                                    <IconButton
                                        aria-label="Toggle password visibility"
                                        onClick={this.handleClickShowPassword}
                                    >
                                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <br />

                    <TextField style={{ width: "260px", marginTop: "8px" }}
                        id="filled-adornment-password2"
                        variant="filled"
                        type={this.state.showPassword ? 'text' : 'password'}
                        label="Confirm Password"
                        value={this.state.confirmPassword}
                        onChange={this.handleChange('confirmPassword')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment variant="filled" position="end">
                                    <IconButton
                                        aria-label="Toggle password visibility"
                                        onClick={this.handleClickShowPassword}
                                    >
                                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <br />

                    <TextField style={{ width: "260px", marginTop: "8px" }}
                        id="filled-adornment-phoneNo"
                        variant="filled"
                        type='number'
                        name='phoneNo'
                        label="Enter Phone Number"
                        value={this.state.phoneNo}
                        onChange={this.handleInput}
                    />
                    <br />
                    <br />
                    <Divider />
                    <br />

                    <Button onClick={this.registerUser} variant="contained" >
                        Register Account
                    </Button>
                </CardContent>
            </Card>
        )
    }

    render() {
        return (
            <div className="center">
                {this.renderRegister()}
            </div>
        );
    }
}


export default Register;
