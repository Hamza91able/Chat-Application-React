import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import { Typography } from '@material-ui/core';
import {
    isMobile
} from "react-device-detect";
import firebase from '../../config/Firebase';

export default class MailFolderListItems extends React.Component {
    state = {
        selectedIndex: '',
        contacts: [],
        uids: [],
    };

    handleListItemClick = (event, index, user, avatar, lastSeen, UID) => {
        const { contacts } = this.state;
        
        this.setState({ selectedIndex: index });
        this.props.setSelectedUserName(user, avatar, lastSeen, UID);
        this.props.getChats(contacts[index])
        if (isMobile) {
            this.props.showChats(UID);
            this.props.hideHeaderBar();
        }
    };

    getContacts = () => {
        const currentUserUID = firebase.auth().currentUser.uid;
        const contactsRef = firebase.database().ref(currentUserUID).child("User Info").child("Contacts");

        contactsRef.once('value', snap => {
            snap.forEach(snap2 => {
                this.setState(prevState => ({
                    uids: [...prevState.uids, snap2.val().UID],
                    contacts: [...prevState.contacts, snap2.val()]
                }))

            })
        })
        this.renderContacts();
        // this.getUpdatedContactPicture();
    }

    getUpdatedContactPicture = () => {
        // const { uids } = this.state;
        // const contactRef = firebase.database().ref(uids).child("User Info");

        // contactRef.once('value', snap => {
        //     // this.setState({
        //     //     // contacts: [...prevState.contacts.currentPhoto, snap.val().currentPhoto]
        //     //     // pics: snap.val().currentPhoto
        //     // })
        // })
    }

    componentWillMount() {
        this.getContacts();
    }
    

    renderContacts() {
        const { contacts } = this.state;

        return (
            <div>
                {contacts.map((value, index) => {
                    return (
                        <div key={index}>
                            <ListItem button
                                selected={this.state.selectedIndex === index}
                            >
                                <Avatar
                                    alt="?"
                                    src={value.currentPhoto}
                                />
                                <ListItemText onClick={event => this.handleListItemClick(event, index, value.FirstName + " " + value.SecondName, value.currentPhoto, value.LastSeen, value.UID)}
                                    primary={<Typography variant="subheading">
                                        {value.FirstName + " " + value.SecondName}
                                    </Typography>}
                                    secondary={<Typography variant="caption">
                                        {value.LastMessage}
                                    </Typography>} />
                            </ListItem>
                            <Divider inset />
                        </div>
                    )
                })}
            </div>
        )

    }

    renderMsgs() {
        // const { chats } = this.state;

        // Render Contacts
        return (
            <div>
                {this.renderContacts()}
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderMsgs()}
            </div>
        )
    }
}