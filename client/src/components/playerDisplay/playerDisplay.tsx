import React from 'react';
import { getCardURL, NUMBER_OF_PLAYER_CARDS } from '../../utils/cards';
import Network from '../../utils/network';
import { store } from '../../utils/redux';
import Button from '../button/button';

import classes from './playerDisplay.module.css'

interface IPlayerDisplayProps {
    username: string
    uid: number
    characterIndex: number
}

interface IPlayerDisplayState {

}

export default class PlayerDisplay extends React.Component<IPlayerDisplayProps, IPlayerDisplayState> {

    constructor(props: IPlayerDisplayProps) {
        super(props);
    }

    render() {
        return (
            <div className={classes.container}>
                {this.props.username}
                <img className={classes.playerCard} src={getCardURL(this.props.characterIndex)} alt="" />
                <img className={classes.playerCard} src={getCardURL(this.props.characterIndex + NUMBER_OF_PLAYER_CARDS)} alt="" />
                {this.getControls()}
            </div>
        );
    }

    getControls = (): JSX.Element | null => {
        if (store.getState().uid === this.props.uid) {
            return (
                <div>
                    <Button clicked={Network.prevCharacter}>Prev</Button>
                    <Button clicked={Network.nextCharacter}>Next</Button>
                </div>
            )
        }
        return null;
    }

}