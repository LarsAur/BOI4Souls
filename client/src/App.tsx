import React from 'react';
import LoginScreen from './screens/login/loginScreen';
import LobbyScreen from './screens/lobby/lobbyScreen';
import GameScreen from './screens/game/gameScreen';
import Network from './utils/network';
import { connect } from 'react-redux';
import { IState, NavState, store } from './utils/redux';

class App extends React.Component {

	componentDidMount() {
		Network.setupNetwork(store);
	}

	render() {
		switch (store.getState().navState) {
			case NavState.GAME:
				return <GameScreen />;
			case NavState.LOBBY:
				return <LobbyScreen />;
			case NavState.LOGIN:
				return <LoginScreen />
		}
	}
}
const mapStateToProps = (state: IState) => {
	return {
		navstate: state.navState
	};
}
export default connect(mapStateToProps)(App);
