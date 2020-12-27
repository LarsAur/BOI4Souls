import React from 'react';
import { getCardURL, lootCardBackURL} from '../../utils/cards';

import classes from './card.module.css';

interface ICardProps {
    cardId: number
    tilted: boolean
    hidden?: boolean
}

export default class Card extends React.Component<ICardProps> {

    onDoubleClick(){
        // Tell server to tilt card here
    }

    render() {
        return (
            <div className={[classes.card, this.props.tilted ? classes.tilted : ""].join(' ')} onDoubleClick={this.onDoubleClick}>
                <img src={this.props.hidden ? lootCardBackURL : getCardURL(this.props.cardId)} alt={this.props.cardId + ""}></img>
            </div>
        )
    }

}