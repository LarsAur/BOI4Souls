import React, { Component } from 'react';
import { w3cwebsocket as webSocket } from 'websocket'

const client = new webSocket("ws://localhost:80")

class App extends Component {

    componentWillMount() {
        client.onopen = () => {
            console.log("Websocket opened");
        }

        client.onmessage = (message) => {
            console.log(message);
        }
    }

    render() {
        return (
            <div className="App">

            </div>

        )
    }
}

export default App;