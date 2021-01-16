import React from 'react';
import PlayerDisplay from '../../components/playerDisplay/playerDisplay';
import { IState, store } from '../../utils/redux';
import { connect } from 'react-redux';
import { getCardURL, NUMBER_OF_PLAYER_CARDS, NUMBER_OF_STARTING_CARDS } from '../../utils/cards';
import Button from '../../components/button/button';

import { IPlayer } from '../../utils/interfaces';

import classes from './lobbyScreen.module.css';
import Network from '../../utils/network';

interface ILobbyState {

}

interface ILobbyProps {

}

class LobbyScreen extends React.Component<ILobbyProps, ILobbyState>{

    componentDidMount(){
        this.preloadCharacterImages();
    }

    render() {
        return (
            <div className={classes.lobbyContainer}>
                <div className={classes.slots}>
                    {this.getDisplays()}
                    {this.getEmpties()}
                </div>

                {/* Display the play button if the player is the least reasently joined player */}
                {Math.min(...store.getState().players.map((player: IPlayer) => player.uid)) === store.getState().uid ? <div className={classes.playButtonContainer}><Button clicked={() => Network.sendStartGameRequest()}>Play!</Button></div> : null}
            </div>
        );
    }

    getDisplays = (): JSX.Element[] => {
        return store.getState().players.map((player: IPlayer, index: number) => {
            return <PlayerDisplay
                key={index}
                uid={player.uid}
                username={player.username}
                characterIndex={player.characterIndex}
            />
        })
    }

    getEmpties = (): JSX.Element[] => {
        let arr = Array(4 - store.getState().players.length).fill(0);
        return arr.map((n: number, index: number) => <div key={index + store.getState().players.length} className={classes.empty}></div>)
    }

    preloadCharacterImages(): void {
        for (let i:number = 0; i < NUMBER_OF_PLAYER_CARDS + NUMBER_OF_STARTING_CARDS; i++){
            let image = new Image();
            image.src = getCardURL(i);
        }
    }

}

const mapStateToProps = (state: IState) => {
    return {
        players: state.players
    };
}
export default connect(mapStateToProps)(LobbyScreen);
