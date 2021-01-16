import React, { Component } from 'react';
import Button from '../../components/button/button';
import Network from '../../utils/network';

import classes from './loginScreen.module.css';

interface ILoginProps{

}

interface ILoginState{
    name: string
}


class LoginScreen extends Component<ILoginProps, ILoginState> {

    constructor(props: ILoginProps){
        super(props);

        this.state = {
            name: "",
        }

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
    }

    onSubmitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        Network.requestJoinLobby(this.state.name);
    }

    onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({name: event.target.value})
    }

    render() {
        return (
            <div className={classes.loginContainer}>
                <form className={classes.loginCenter} onSubmit={this.onSubmitHandler} autoComplete="off">
                    <input type="text" placeholder="Name" onChange={this.onNameChange} required autoComplete="off"></input>
                    <Button type="submit">Join Lobby</Button>
                </form>
            </div>
        )
    }
}

export default LoginScreen;