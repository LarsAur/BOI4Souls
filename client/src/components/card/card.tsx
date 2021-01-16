import React from 'react';
import { getCardBackURL, getCardURL } from '../../utils/cards';
import Network from '../../utils/network';
import { store } from '../../utils/redux'

import { IGameData } from '../../utils/interfaces';

import classes from './card.module.css';

interface ICardProps {
    cardId: number
    inOwnedField: boolean
    hidden?: boolean
}

export default class Card extends React.Component<ICardProps> {

    constructor(props: ICardProps) {
        super(props);
        this.preloadCardImage();
    }

    onDoubleClick() {
        if (this.props.inOwnedField) {
            let gameData: IGameData = store.getState().gameData;
            Network.sendTiltRequest(this.props.cardId, !gameData.tiltLookup[this.props.cardId])
        }
    }

    render() {
        return (
            <div className={[classes.card, store.getState().gameData.tiltLookup[this.props.cardId] ? classes.tilted : ""].join(' ')}>
                <img src={this.props.hidden ? getCardBackURL(this.props.cardId) : getCardURL(this.props.cardId)} alt={this.props.cardId + ""} onDoubleClick={() => this.onDoubleClick()}></img>
                {
                    this.props.inOwnedField || store.getState().gameData.counterLookup[this.props.cardId] > 0?
                        <div className={classes.cardMenu}>
                                <button
                                    style={!this.props.inOwnedField ? {visibility: 'hidden'} : {}}
                                    onClick={() => Network.requestCardDecrement(this.props.cardId)}>-</button>
                                <span className={classes.counterDisplay}>
                                    {store.getState().gameData.counterLookup[this.props.cardId]}
                                </span>
                                <button
                                    style={!this.props.inOwnedField ? {visibility: 'hidden'} : {}} 
                                    onClick={() => Network.requestCardIncrement(this.props.cardId)}>+</button>
                        </div>
                        :
                        null
                }
            </div>
        )
    }

    preloadCardImage() {
        let image = new Image();
        image.src = getCardURL(this.props.cardId);
    }

}