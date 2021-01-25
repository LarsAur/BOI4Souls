import React from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

import { IPlayer, IGameData, DroppableType, handAccessibilityToMap, handVisibilityToMap, IGameEdit } from '../../utils/interfaces';
import { IState, store } from '../../utils/redux';

import Dice from '../../components/dice/dice';
import Card from '../../components/card/card';
import Modal from '../../components/modal/modal';
import Button from '../../components/button/button';

import classes from './gameScreen.module.css';
import editStyle from './editStyle.module.css'
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

interface IGameScreenState {
    currentDeckEdit: "treasure" | "monster" | "loot" | "souls"
    temporaryEditField: number[]
}

interface IGameScreenProps {

}

class GameScreen extends React.Component<IGameScreenProps, IGameScreenState> {


    constructor(props: IGameScreenProps) {
        super(props);

        this.state = {
            currentDeckEdit: "loot",
            temporaryEditField: [],
        }

        this.onModalDragEnd = this.onModalDragEnd.bind(this);
        this.getEditModal = this.getEditModal.bind(this);
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

    onModalDragEnd(result: DropResult) {
        if (!result.destination) return;

        console.log(result);

        const src: string = result.source.droppableId;
        const dest: string = result.destination.droppableId;

        const srcIndex: number = result.source.index;
        const destIndex: number = result.destination.index;

        const playerIndex: number = store.getState().gameData.players.findIndex((player: IPlayer) => player.uid === store.getState().gameData.deckEditUid);
        let cardId: number = -1;
        switch (src) {
            case "playerhand":
                [cardId] = store.getState().gameData.players[playerIndex].hand.splice(srcIndex, 1);
                break;
            case "playerfield":
                [cardId] = store.getState().gameData.players[playerIndex].field.splice(srcIndex, 1);
                break;
            case "loot-discard":
                [cardId] = store.getState().gameData.discardLootPile.splice(srcIndex, 1);
                break;
            case "loot-deck":
                [cardId] = store.getState().gameData.lootDeck.splice(0, 1);
                break;
            case "loot-deckBottom":
                [cardId] = store.getState().gameData.lootDeck.splice(store.getState().gameData.lootDeck.length - 1, 1);
                break;
            case "treasure-field":
                [cardId] = store.getState().gameData.treasureField.splice(srcIndex, 1);
                break;
            case "treasure-discard":
                [cardId] = store.getState().gameData.discardTreasurePile.splice(0, 1);
                break;
            case "treasure-deck":
                [cardId] = store.getState().gameData.treasureDeck.splice(0, 1);
                break;
            case "treasure-deckBottom":
                [cardId] = store.getState().gameData.treasureDeck.splice(store.getState().gameData.treasureDeck.length - 1, 1);
                break;
            case "monster-field":
                [cardId] = store.getState().gameData.monsterField.splice(srcIndex, 1);
                break;
            case "monster-discard":
                [cardId] = store.getState().gameData.discardMonsterPile.splice(0, 1);
                break;
            case "monster-deck":
                [cardId] = store.getState().gameData.monsterDeck.splice(0, 1);
                break;
            case "monster-deckBottom":
                [cardId] = store.getState().gameData.monsterDeck.splice(store.getState().gameData.monsterDeck.length - 1, 1);
                break;
            case "souls-field":
                [cardId] = store.getState().gameData.bonusSoulsDeck.splice(srcIndex, 1);
                break;
            case "tmp":
                [cardId] = this.state.temporaryEditField.splice(srcIndex, 1);
                break;
            default:
                console.log("ERROR in edit modal from src:", src);
        }

        switch (dest) {
            case "playerhand":
                store.getState().gameData.players[playerIndex].hand.splice(destIndex, 0, cardId);
                break;
            case "playerfield":
                store.getState().gameData.players[playerIndex].field.splice(destIndex, 0, cardId);
                break;
            case "loot-discard":
                store.getState().gameData.discardLootPile.splice(destIndex, 0, cardId);
                break;
            case "loot-deck":
                store.getState().gameData.lootDeck.splice(0, 0, cardId);
                break;
            case "loot-deckBottom":
                store.getState().gameData.lootDeck.push(cardId)
                break;
            case "treasure-field":
                store.getState().gameData.treasureField.splice(destIndex, 0, cardId);
                break;
            case "treasure-discard":
                store.getState().gameData.discardTreasurePile.splice(0, 0, cardId);
                break;
            case "treasure-deck":
                store.getState().gameData.treasureDeck.splice(0, 0, cardId);
                break;
            case "treasure-deckBottom":
                store.getState().gameData.treasureDeck.push(cardId)
                break;
            case "monster-field":
                store.getState().gameData.monsterField.splice(destIndex, 0, cardId);
                break;
            case "monster-discard":
                store.getState().gameData.discardMonsterPile.splice(0, 0, cardId);
                break;
            case "monster-deck":
                store.getState().gameData.monsterDeck.splice(0, 0, cardId);
                break;
            case "monster-deckBottom":
                store.getState().gameData.monsterDeck.push(cardId);
                break;
            case "souls-field":
                store.getState().gameData.bonusSoulsDeck.splice(destIndex, 0, cardId);
                break;
            case "tmp":
                this.state.temporaryEditField.splice(destIndex, 0, cardId);
                break;
            default:
                console.log("ERROR in edit modal from destination:", dest);
        }

        this.forceUpdate();
    }

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className={classes.container}>
                    <div className={classes.dice}>
                        <Dice />
                        {this.getEditMenu()}
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

                    {store.getState().gameData.deckEditUid === store.getState().uid ? this.getEditModal() : null}
                </div>
            </DragDropContext>
        )
    }

    getMonsterDiscardPile(): JSX.Element {
        let cardId = store.getState().gameData.discardMonsterPile.length > 0 ? store.getState().gameData.discardMonsterPile[0] : -1;
        const disabled = store.getState().gameData.deckEditUid !== null;
        return (
            <div className={classes.discardMonsterPile}>
                Monster Discard
                <Droppable droppableId={"1-monsterDiscard"} direction={"horizontal"} isDropDisabled={disabled}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getCenterListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {cardId !== -1 ? <Draggable key={cardId} draggableId={cardId + "-card"} index={0} isDragDisabled={disabled}>
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
        const disabled = store.getState().gameData.deckEditUid !== null;
        return (
            <div className={classes.monsterField}>
                Monsters
                <Droppable droppableId={1 + "-monsterField"} direction={"horizontal"} isDropDisabled={disabled}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {store.getState().gameData.monsterField.map((id: number, index: number) => (
                                <Draggable key={id} draggableId={id + "-card"} index={index} isDragDisabled={disabled}>
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
        const disabled = store.getState().gameData.deckEditUid !== null;
        return (
            <div className={classes.monsterCards}>
                MonsterDeck
                <Droppable droppableId={"1-monsterDeck"} direction={"horizontal"} isDropDisabled={disabled}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getCenterListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >

                            <Draggable key={cardId} draggableId={cardId + "-card"} index={0} isDragDisabled={disabled}>
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
        const disabled = store.getState().gameData.deckEditUid !== null;
        return (
            <div className={classes.treasureField}>
                Treasures
                <Droppable droppableId={1 + "-treasureField"} direction={"horizontal"} isDropDisabled={disabled}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {store.getState().gameData.treasureField.map((id: number, index: number) => (
                                <Draggable key={id} draggableId={id + "-card"} index={index} isDragDisabled={disabled}>
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
        const disabled = store.getState().gameData.deckEditUid !== null;
        return (
            <div className={classes.treasureCards}>
                Treasure Deck
                <Droppable droppableId={"1-treasureDeck"} direction={"horizontal"} isDropDisabled={disabled}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getCenterListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >

                            <Draggable key={cardId} draggableId={cardId + "-card"} index={0} isDragDisabled={disabled}>
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
        const disabled = store.getState().gameData.deckEditUid !== null;
        return (
            <div className={classes.discardLootPile}>
                Loot Discard
                <Droppable droppableId={"1-lootDiscard"} direction={"horizontal"} isDropDisabled={disabled}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getCenterListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {cardId !== -1 ? <Draggable key={cardId} draggableId={cardId + "-card"} index={0} isDragDisabled={disabled}>
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
        const disabled = store.getState().gameData.deckEditUid !== null;
        return (
            <div className={classes.lootCards}>
                Loot Deck
                <Droppable droppableId={"1-lootDeck"} direction={"horizontal"} isDropDisabled={disabled}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getCenterListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >

                            <Draggable key={cardId} draggableId={cardId + "-card"} index={0} isDragDisabled={disabled}>
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

        const handVisibility = handVisibilityToMap(store.getState().gameData.handVisibility);
        const handAccessibility = handAccessibilityToMap(store.getState().gameData.handAccessibility);

        return store.getState().players.map((player: IPlayer, index: number) => (
            <div key={"handkey" + index} className={classes["player" + (index + 1) + "Hand"]}>
                {index < 2 ? this.getPlayerBar(player) : null}
                <Droppable droppableId={index + "-hand"} direction={"horizontal"} isDropDisabled={(player.uid !== store.getState().uid && !handAccessibility.get(player.uid))}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={this.getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {player.hand.map((id: number, index: number) => (
                                <Draggable key={id} draggableId={id + "-card"} index={index} isDragDisabled={(player.uid !== store.getState().uid && !handAccessibility.get(player.uid))}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Card cardId={id} inOwnedField={false} hidden={!handVisibility.get(store.getState().uid)?.get(player.uid)} />
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

        const handAccessibility: Map<number, boolean> = handAccessibilityToMap(store.getState().gameData.handAccessibility);
        const handVisibility: Map<number, Map<number, boolean>> = handVisibilityToMap(store.getState().gameData.handVisibility);

        // Current Player
        if (player.uid === store.getState().uid) {
            return (
                <div className={classes.playerInfo}>
                    <span>{player.username}</span>
                    <div style={{ display: "flex", justifyContent: "space-between", width: 190 }}>
                        <button onClick={() => Network.requestSetHandAccessibility(!handAccessibility.get(store.getState().uid))}>
                            {handAccessibility.get(store.getState().uid) ? "Close Hand" : "Open Hand"}
                        </button>
                        <button onClick={Network.requestCentDecrement}><b>-</b></button>
                        <img src="https://www.flaticon.com/svg/static/icons/svg/1757/1757191.svg" alt="Cent"></img> : {player.coins}
                        <button onClick={Network.requestCentIncrement}><b>+</b></button>
                    </div>
                </div>
            )
        }

        // Other players

        let currentVisability: boolean = handVisibility.get(player.uid)?.get(store.getState().uid) as boolean

        return (
            <div className={classes.playerInfo}>
                <span>{player.username}</span>
                {player.uid === store.getState().gameData.deckEditUid ? "Editing..." : null}
                <div style={{ display: "flex", justifyContent: "space-between", width: 160 }}>
                    <button onClick={() => Network.requestSetHandVisability(!currentVisability, player.uid)}>
                        {currentVisability ? "Hide Hand" : "Show Hand"}
                    </button>
                    <img src="https://www.flaticon.com/svg/static/icons/svg/1757/1757191.svg" alt="Cent"></img> : {player.coins}
                </div>
            </div>
        )
    }

    getEditMenu() {
        return (
            <div className={classes.editButton}>
                <Menu menuButton={<MenuButton>Edit a deck</MenuButton>}
                    onClick={(data: any) => {
                        Network.sendEditRequest();
                        this.setState({ currentDeckEdit: data.value })
                    }}>
                    <MenuItem value={"treasure"}>Treasure</MenuItem>
                    <MenuItem value={"loot"}>Loot</MenuItem>
                    <MenuItem value={"monster"}>Monster</MenuItem>
                    <MenuItem value={"souls"}>Bonus Souls</MenuItem>
                </Menu>
            </div>
        );
    }

    getEditModal() {
        let deck: number[] | undefined;
        let field: number[] | undefined;
        let discard: number[] | undefined;

        switch (this.state.currentDeckEdit) {
            case "loot":
                deck = store.getState().gameData.lootDeck;
                field = undefined;
                discard = store.getState().gameData.discardLootPile;
                break;
            case "monster":
                deck = store.getState().gameData.monsterDeck;
                field = store.getState().gameData.monsterField;
                discard = store.getState().gameData.discardMonsterPile;
                break;
            case "treasure":
                deck = store.getState().gameData.treasureDeck;
                field = store.getState().gameData.treasureField;
                discard = store.getState().gameData.discardTreasurePile;
                break;
            case "souls":
                deck = undefined;
                field = store.getState().gameData.bonusSoulsDeck;
                discard = undefined;
                break;
        }

        let discardTop: number = discard !== undefined ? (discard.length > 0 ? discard[0] : -1) : -1;
        let deckTop: number = deck !== undefined ? (deck.length > 0 ? deck[0] : -1) : -1;
        let deckBottom: number = deck !== undefined ? (deck.length > 0 ? deck[deck.length - 1] : -1) : -1;

        const player: IPlayer = store.getState().players.find((player: IPlayer) => player.uid === store.getState().gameData.deckEditUid) as IPlayer;
        return (
            <Modal
                handleApply={() => {
                    if (this.state.temporaryEditField.length === 0) {

                        const edit: IGameEdit = {
                            uid: player.uid,
                            playerHand: player.hand,
                            playerField: player.field,

                            lootDeck: store.getState().gameData.lootDeck,
                            lootDiscard: store.getState().gameData.discardLootPile,
                            treasureDeck: store.getState().gameData.treasureDeck,
                            treasureDiscard: store.getState().gameData.discardTreasurePile,
                            treasureField: store.getState().gameData.treasureField,
                            monsterDeck: store.getState().gameData.monsterDeck,
                            monsterDiscard: store.getState().gameData.discardMonsterPile,
                            monsterField: store.getState().gameData.monsterField,
                            bonusSouls: store.getState().gameData.bonusSoulsDeck,
                        }

                        Network.publishEdit(edit);
                        Network.relieveEdit();
                    }
                }
                }
                handleCancel={() => {
                    this.setState({ temporaryEditField: [] });
                    Network.requestGameDataRefresh();
                    Network.relieveEdit();
                }
                }>
                <DragDropContext onDragEnd={this.onModalDragEnd}>
                    <div className={editStyle.container}>
                        <div className={editStyle.playerHand}>
                            Your hand
                            <Droppable droppableId={"playerhand"} direction={"horizontal"}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={this.getListStyle(snapshot.isDraggingOver)}
                                        {...provided.droppableProps}
                                    >
                                        {player.hand.map((id: number, index: number) => (
                                            <Draggable key={id} draggableId={id + "-editcard"} index={index}>
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

                        <div className={editStyle.playerField}>
                            Your field
                            <Droppable droppableId={"playerfield"} direction={"horizontal"}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={this.getListStyle(snapshot.isDraggingOver)}
                                        {...provided.droppableProps}
                                    >
                                        {player.field.map((id: number, index: number) => (
                                            <Draggable key={id} draggableId={id + "-card"} index={index}>
                                                {(provided, snapshot) => (
                                                    <div ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <Card cardId={id} inOwnedField={false} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                        {
                            field !== undefined ?
                                <div className={editStyle.field}>
                                    Open Cards
                                    <Droppable droppableId={this.state.currentDeckEdit + "-field"} direction={"horizontal"}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={this.getListStyle(snapshot.isDraggingOver)}
                                                {...provided.droppableProps}
                                            >
                                                {(field as number[]).map((id: number, index: number) => (
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
                                :
                                null
                        }

                        <div className={editStyle.tmp}>
                            Temporary editing...
                            <Droppable droppableId={"tmp"} direction={"horizontal"}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={this.getListStyle(snapshot.isDraggingOver)}
                                        {...provided.droppableProps}
                                    >
                                        {this.state.temporaryEditField.map((id: number, index: number) => (
                                            <Draggable key={id} draggableId={id + "-card"} index={index} isDragDisabled={player.uid !== store.getState().uid}>
                                                {(provided, snapshot) => (
                                                    <div ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <Card cardId={id} inOwnedField={false} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                        {
                            deck !== undefined ?
                                <div className={editStyle.deck}>
                                    Deck
                                    <Droppable droppableId={this.state.currentDeckEdit + "-deck"} direction={"horizontal"}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={this.getCenterListStyle(snapshot.isDraggingOver)}
                                                {...provided.droppableProps}
                                            >
                                                {
                                                    deckTop !== -1 ? <Draggable key={deckTop} draggableId={deckTop + "-card"} index={0}>
                                                        {(provided, snapshot) => (
                                                            <div ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <Card cardId={deckTop} inOwnedField={false} hidden={true} />
                                                            </div>
                                                        )}
                                                    </Draggable> : null
                                                }
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                    <Button clicked={() => {
                                        switch (this.state.currentDeckEdit) {
                                            case "loot":
                                                store.getState().gameData.lootDeck = GameScreen.inplaceShuffle(deck as number[]);
                                                break;
                                            case "monster":
                                                store.getState().gameData.monsterDeck = GameScreen.inplaceShuffle(deck as number[]);
                                                break;
                                            case "treasure":
                                                store.getState().gameData.treasureDeck = GameScreen.inplaceShuffle(deck as number[]);
                                                break;
                                        }
                                        this.forceUpdate();
                                    }}>Shuffle</Button>
                                </div>
                                :
                                null
                        }

                        {
                            deck !== undefined ?
                                <div className={editStyle.bottom}>
                                    Deck Bottom
                                    <Droppable droppableId={this.state.currentDeckEdit + "-deckBottom"} direction={"horizontal"}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={this.getCenterListStyle(snapshot.isDraggingOver)}
                                                {...provided.droppableProps}
                                            >
                                                {
                                                    deckBottom !== -1 ? <Draggable key={deckBottom} draggableId={deckBottom + "-card"} index={0}>
                                                        {(provided, snapshot) => (
                                                            <div ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <Card cardId={deckBottom} inOwnedField={false} hidden={false} />
                                                            </div>
                                                        )}
                                                    </Draggable> : null
                                                }
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>

                                </div>
                                :
                                null
                        }

                        {
                            discard !== undefined ?
                                <div className={editStyle.discard}>
                                    Discard
                                    <Droppable droppableId={this.state.currentDeckEdit + "-discard"} direction={"horizontal"}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={this.getCenterListStyle(snapshot.isDraggingOver)}
                                                {...provided.droppableProps}
                                            >
                                                {
                                                    discardTop !== -1 ? <Draggable key={discardTop} draggableId={discardTop + "-card"} index={0}>
                                                        {(provided, snapshot) => (
                                                            <div ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <Card cardId={discardTop} inOwnedField={false} hidden={false} />
                                                            </div>
                                                        )}
                                                    </Draggable> : null
                                                }
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                    {discardTop !== -1 ? <Button clicked={() => {
                                        const concat: number[] = deck?.concat(discard as number[]) as number[];
                                        switch (this.state.currentDeckEdit) {
                                            case "loot":
                                                store.getState().gameData.lootDeck = GameScreen.inplaceShuffle(concat);
                                                store.getState().gameData.discardLootPile = [];
                                                break;
                                            case "monster":
                                                store.getState().gameData.monsterDeck = GameScreen.inplaceShuffle(concat);
                                                store.getState().gameData.discardMonsterPile = [];
                                                break;
                                            case "treasure":
                                                store.getState().gameData.treasureDeck = GameScreen.inplaceShuffle(concat);
                                                store.getState().gameData.discardTreasurePile = [];
                                                break;
                                        }
                                        this.forceUpdate();
                                    }}>Shuffle Into Deck</Button> : null}

                                </div>
                                :
                                null
                        }
                    </div>
                </DragDropContext>
            </Modal>
        );
    }

    static inplaceShuffle(deck: any[]): any[] {
        let m = deck.length;
        let t;
        let i;

        while (m !== 0) {
            // Select a random element in the first part of the array
            i = Math.floor(Math.random() * m--);

            // Swap the current index and the end of the first part
            t = deck[m];
            deck[m] = deck[i];
            deck[i] = t;
        }

        return deck;
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
