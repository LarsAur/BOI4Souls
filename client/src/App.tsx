import React from 'react';
import LoginScreen from './screens/login/loginScreen';
import Network from './utils/network';

class App extends React.Component{

	componentDidMount(){
		Network.connect();
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
