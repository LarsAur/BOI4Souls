import React from 'react';
import { connect } from 'react-redux';
import Dice from '../../components/dice/dice';
import { IGameData, IState, store } from '../../utils/redux';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { IPlayer } from '../../utils/redux';
import Card from '../../components/card/card';

import classes from './gameScreen.module.css';
import Network from '../../utils/network';

class GameScreen extends React.Component {


    componentDidUpdate(){
        console.log("componentUPDATA")
    }
    onDragEnd = (result: DropResult) => {
        //src: https://codesandbox.io/s/mmrp44okvj?file=/index.js
        if (!result.destination) return;

        let startListType: string = result.source.droppableId.split("-")[1];
        let startListIndex: number = Number.parseInt(result.source.droppableId.split("-")[0]);
        let startInnerIndex: number = result.source.index;
        let endListType: string = result.destination.droppableId.split("-")[1];
        let endListIndex: number = Number.parseInt(result.destination.droppableId.split("-")[0]);
        let endInnerIndex: number = result.destination.index;

        let gameData: IGameData = store.getState().gameData;

        let cardId: number = -1;
        switch (startListType) {
            case "hand":
                [cardId] = gameData.players[startListIndex].hand.splice(startInnerIndex, 1);
                break;
            case "field":
                [cardId] = gameData.players[startListIndex].field.splice(startInnerIndex, 1);
                break;
            default:
                console.log("No start type")
        }

        switch (endListType) {
            case "hand":
                gameData.players[endListIndex].hand.splice(endInnerIndex, 0, cardId)
                break;
            case "field":
                gameData.players[endListIndex].field.splice(endInnerIndex, 0, cardId)
                break;
            default:
                console.log("No end list type")
        }

        console.log(gameData)

        Network.sendNewGameData(gameData);
    };

    render() {

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className={classes.container}>
                    {this.getHandAreas()}
                    {this.getFieldAreas()}
                    <div className={classes.dice}>
                        <Dice />
                    </div>
                </div>
            </DragDropContext>
        )
    }

    getHandAreas(): JSX.Element[] {
        return store.getState().players.map((player: IPlayer, index: number) => (
            <div key={"handkey" + index} className={classes["player" + (index + 1) + "Hand"]}>
                <Droppable droppableId={index + "-hand"} direction={"horizontal"} isDropDisabled={player.uid !== store.getState().uid}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {player.hand.map((id: number, index: number) => (
                                <Draggable key={id} draggableId={id + "-card"} index={index} isDragDisabled={player.uid !== store.getState().uid}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Card cardId={id} tilted={false} hidden={store.getState().uid !== player.uid} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        ))
    }

    getFieldAreas() {
        return store.getState().players.map((player: IPlayer, index: number) => (
            <div key={"fieldkey" + player.uid} className={classes["player" + (index + 1) + "Field"]}>
                <Droppable droppableId={index + "-field"} direction={"horizontal"} isDropDisabled={player.uid !== store.getState().uid}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {player.field.map((id: number, index: number) => (
                                <Draggable key={id} draggableId={id + "-card"} index={index} isDragDisabled={player.uid !== store.getState().uid}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Card cardId={id} tilted={false} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        ))
    }

    getTreasureCardField() {

    }

    getMonsterCardField() {

    }

    getItemStyle(isDragging: boolean, draggableStyle: any) {
        return {
            ...draggableStyle,
        }
    };

    getListStyle(isDraggingOver: boolean) {
        return {
            display: 'flex',
        }
    };


}

const mapStateToProps = (state: IState) => {
    return {
        gameDataToggle: state.gameData
    };
}
export default connect(mapStateToProps)(GameScreen);
