import React from 'react';
import Network from '../../utils/network';
import { store, IState } from '../../utils/redux';
import { connect } from 'react-redux';

import classes from './dice.module.css'

class Dice extends React.Component {

    render() {
        return (
            <div>
                <div className={classes.numberDisplay} onClick={() => Network.rollDice()}>
                    {store.getState().diceValue}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: IState) => {
    return {
        navstate: state.rollToggle
    };
}
export default connect(mapStateToProps)(Dice);
