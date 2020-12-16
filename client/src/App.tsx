import React from 'react';
import LoginScreen from './screens/login/loginScreen';
import Network from './utils/network';
import store from './utils/redux';

class App extends React.Component{

	componentDidMount(){
		Network.setupNetwork(store);
	}

	render(){
		return (
			<div className="App">
				<LoginScreen />
			</div>
		);
	}
}

export default App;
