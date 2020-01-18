import React, { Component } from 'react';
import './Login.css';
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

class Login extends Component {
    state = {
        amount: '',
        email: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    };

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleInput = event => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    handleClickShowPassword = () => {
        this.setState(state => ({ showPassword: !state.showPassword }));
    };

    loginUser = () => {
        const { email, password } = this.state;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                // this.props.showChatHub();
                this.props.loginUser();
            })
            .catch(error => {
                // Handle Errors here.
                swal("" + error);
                // ...
            });
    }

    renderLogin() {

        return (
            <Card>
                <CardContent>
                    <Typography variant="title" component="h2">
                        LOGIN:
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
                    <br />

                    <TextField style={{ width: "260px" }}
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
                    <br />
                    <Divider />
                    <br />

                    <Button onClick={this.loginUser} variant="contained" color="primary" style={{ margin: "theme.spacing.unit" }} >
                        Login
                    </Button>

                    <Button onClick={() => this.props.hideLogin()} variant="contained" style={{ marginLeft: "15px" }} >
                        Register Account
                    </Button>
                </CardContent>
            </Card>
        )
    }

    render() {
        return (
            <div className="center">
                {this.renderLogin()}
            </div>
        );
    }
}


export default Login;
