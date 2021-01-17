import React from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import { IPlayer, IGameData, DroppableType } from '../../utils/interfaces';
import { IState, store } from '../../utils/redux';

import Dice from '../../components/dice/dice';
import Card from '../../components/card/card';
import Modal from '../../components/modal/modal';

import classes from './gameScreen.module.css';
import Network from '../../utils/network';

const listTypeToDroppableType = new Map<string, DroppableType>([
    ["monsterField", DroppableType.MonsterField],
    ["monsterDeck", DroppableType.MonsterDeck],
    ["monsterDiscard", DroppableType.MonsterDiscard],
    ["treasureDeck", DroppableType.TreasureDeck],
    ["treasureField", DroppableType.TreasureField],
    ["lootDeck", DroppableType.LootDeck],
    ["lootDiscard", DroppableType.LootDiscard],
    ["hand", DroppableType.Hand],
    ["field", DroppableType.Field],
]);

class GameScreen extends React.Component {

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
                cardId = gameData.players[startListIndex].hand[startInnerIndex];
                break;
            case "field":
                cardId = gameData.players[startListIndex].field[startInnerIndex]
                break;
            case "lootDeck":
                cardId = gameData.lootDeck[0];
                break;
            case "lootDiscard":
                cardId = gameData.discardLootPile[0];
                break;
            case "treasureDeck":
                cardId = gameData.treasureDeck[0];
                break;
            case "monsterDeck":
                cardId = gameData.monsterDeck[0];
                break;
            case "treasureField":
                cardId = gameData.treasureField[startInnerIndex];
                break;
            case "monsterField":
                cardId = gameData.monsterField[startInnerIndex];
                break;
            case "monsterDiscard":
                cardId = gameData.discardMonsterPile[startInnerIndex];
                break;
            default:
                console.log("No start type")
        }

        // If the card is dropped into a deck, it will always be dropped to the top
        if ([
            DroppableType.LootDeck,
            DroppableType.LootDiscard,
            DroppableType.MonsterDeck,
            DroppableType.MonsterDiscard,
            DroppableType.TreasureDeck
        ].includes(listTypeToDroppableType.get(endListType) as DroppableType)) {
            endInnerIndex = 0;
        }

        Network.sendMoveRequest(
            listTypeToDroppableType.get(startListType) as DroppableType,
            startListIndex,
            startInnerIndex,
            listTypeToDroppableType.get(endListType) as DroppableType,
            endListIndex,
            endInnerIndex,
            cardId,
        );
    };

    render() {

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className={classes.container}>
                    <div className={classes.dice}>
                        <Dice />
                    </div>
                    {this.getHandAreas()}
                    {this.getFieldAreas()}
                    {this.getLootDeckArea()}
                    {this.getTreasureDeckArea()}
                    {this.getTreasureField()}
                    {this.getMonsterDeckArea()}
                    {this.getMonsterField()}
                    {this.getMonsterDiscardPile()}
                    {this.getDiscardLootPile()}

                    <Modal display={true} handleClose={() => console.log("close")}></Modal>
                </div>
            </DragDropContext>
        )
    }

    getMonsterDiscardPile(): JSX.Element {
        let cardId = store.getState().gameData.discardMonsterPile.length > 0 ? store.getState().gameData.discardMonsterPile[0] : -1;
        return (
            <div className={classes.discardMonsterPile}>
                Monster Discard
                <Droppable droppableId={"1-monsterDiscard"} direction={"horizontal"}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getCenterListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {cardId !== -1 ? <Draggable key={cardId} draggableId={cardId + "-card"} index={0}>
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Card cardId={cardId} inOwnedField={false} />
                                    </div>
                                )}
                            </Draggable> : null}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        )
    }

    getMonsterField(): JSX.Element {
        return (
            <div className={classes.monsterField}>
                Monsters
                <Droppable droppableId={1 + "-monsterField"} direction={"horizontal"}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {store.getState().gameData.monsterField.map((id: number, index: number) => (
                                <Draggable key={id} draggableId={id + "-card"} index={index}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Card cardId={id} inOwnedField={false} hidden={false} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        )
    }

    getMonsterDeckArea() {
        let cardId: number = store.getState().gameData.monsterDeck.length > 0 ? store.getState().gameData.monsterDeck[0] : -1;
        return (
            <div className={classes.monsterCards}>
                MonsterDeck
                <Droppable droppableId={"1-monsterDeck"} direction={"horizontal"}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getCenterListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >

                            <Draggable key={cardId} draggableId={cardId + "-card"} index={0}>
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Card cardId={cardId} inOwnedField={false} hidden={true} />
                                    </div>
                                )}
                            </Draggable>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

            </div >
        )
    }

    getTreasureField(): JSX.Element {
        return (
            <div className={classes.treasureField}>
                Treasures
                <Droppable droppableId={1 + "-treasureField"} direction={"horizontal"}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {store.getState().gameData.treasureField.map((id: number, index: number) => (
                                <Draggable key={id} draggableId={id + "-card"} index={index}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Card cardId={id} inOwnedField={false} hidden={false} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        )
    }

    getTreasureDeckArea(): JSX.Element {
        let cardId: number = store.getState().gameData.treasureDeck.length > 0 ? store.getState().gameData.treasureDeck[0] : -1;
        return (
            <div className={classes.treasureCards}>
                TreasureDeck
                <Droppable droppableId={"1-treasureDeck"} direction={"horizontal"}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getCenterListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >

                            <Draggable key={cardId} draggableId={cardId + "-card"} index={0}>
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Card cardId={cardId} inOwnedField={false} hidden={true} />
                                    </div>
                                )}
                            </Draggable>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div >
        )
    }

    getDiscardLootPile(): JSX.Element {
        let cardId = store.getState().gameData.discardLootPile.length > 0 ? store.getState().gameData.discardLootPile[0] : -1;
        return (
            <div className={classes.discardLootPile}>
                DiscardPile
                <Droppable droppableId={"1-lootDiscard"} direction={"horizontal"}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getCenterListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {cardId !== -1 ? <Draggable key={cardId} draggableId={cardId + "-card"} index={0}>
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Card cardId={cardId} inOwnedField={false} />
                                    </div>
                                )}
                            </Draggable> : null}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        )
    }

    getLootDeckArea(): JSX.Element {
        let cardId: number = store.getState().gameData.lootDeck.length > 0 ? store.getState().gameData.lootDeck[0] : -1;
        return (
            <div className={classes.lootCards}>
                LootDeck
                <Droppable droppableId={"1-lootDeck"} direction={"horizontal"}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getCenterListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >

                            <Draggable key={cardId} draggableId={cardId + "-card"} index={0}>
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Card cardId={cardId} inOwnedField={false} hidden={true} />
                                    </div>
                                )}
                            </Draggable>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div >
        )
    }

    getHandAreas(): JSX.Element[] {
        return store.getState().players.map((player: IPlayer, index: number) => (
            <div key={"handkey" + index} className={classes["player" + (index + 1) + "Hand"]}>
                {index < 2 ? this.getPlayerBar(player) : null}
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
                                            <Card cardId={id} inOwnedField={false} hidden={store.getState().uid !== player.uid} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                {index >= 2 ? this.getPlayerBar(player) : null}
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
                                            <Card cardId={id} inOwnedField={player.uid === store.getState().uid} />
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

    getPlayerBar(player: IPlayer) {
        return (
            <div className={classes.playerInfo}>
                <span>{player.username}</span>
                {player.uid === store.getState().uid ? 
                <div style={{ display: "flex", justifyContent: "space-between", width: 100 }}>
                    <button onClick={Network.requestCentDecrement}><b>-</b></button>
                    <img src="https://www.flaticon.com/svg/static/icons/svg/1757/1757191.svg" alt="Cent"></img> : {player.coins}
                    <button onClick={Network.requestCentIncrement}><b>+</b></button>
                </div>
                :
                <div style={{ display: "flex", justifyContent: "space-between", width: 45 }}>
                    <img src="https://www.flaticon.com/svg/static/icons/svg/1757/1757191.svg" alt="Cent"></img> : {player.coins}
                </div>
                }
            </div>
        )
    }

    getItemStyle(isDragging: boolean, draggableStyle: any) {
        return {
            ...draggableStyle,
        }
    };

    getCenterListStyle(isDraggingOver: boolean) {
        return {
            display: 'flex',
            justifyContent: 'center',
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
        gameData: state.gameData
    };
}
export default connect(mapStateToProps)(GameScreen);
