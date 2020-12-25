import React from 'react';
import { connect } from 'react-redux';
import Dice from '../../components/dice/dice';
import { IState, store } from '../../utils/redux';

import classes from './gameScreen.module.css';

class GameScreen extends React.Component {

    render(){
        return(
            <div className={classes.container}>

                <div className={classes.dice}>
                    <Dice />
                </div>

            </div>
        )
    }

}

const mapStateToProps = (state: IState) => {
	return {

	};
}
export default connect(mapStateToProps)(GameScreen);
