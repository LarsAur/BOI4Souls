import { IPlayer, IGameData, IMove, DroppableType, IGameEdit } from '../../client/src/utils/interfaces';
import { getAllBonusCards, getAllMonsterCards, getAllLootCards, getAllTreasureCards, getEternalCardIdFromCharacterId, NUMBER_OF_CARDS } from './card';

export default class BOIGame {

    players: IPlayer[];

    monsterDeck: number[];
    lootDeck: number[];
    treasureDeck: number[];
    bonusSoulsDeck: number[];

    monsterField: number[];
    treasureField: number[];

    discardLootPile: number[];
    discardMonsterPile: number[];
    discardTreasurePile: number[];

    tiltLookup: boolean[];
    counterLookup: number[];

    handVisability: Map<number, Map<number, boolean>>;
    handAccessibility: Map<number, boolean>;
    deckEditUid: number | null;

    constructor(players: IPlayer[]) {
        this.players = players;

        this.monsterDeck = BOIGame.inplaceShuffle(getAllMonsterCards());
        this.lootDeck = BOIGame.inplaceShuffle(getAllLootCards());
        this.treasureDeck = BOIGame.inplaceShuffle(getAllTreasureCards());
        this.bonusSoulsDeck = getAllBonusCards();

        this.monsterField = [];
        this.treasureField = [];

        this.discardLootPile = [];
        this.discardMonsterPile = [];
        this.discardTreasurePile = [];

        this.tiltLookup = new Array(NUMBER_OF_CARDS).fill(false);
        this.counterLookup = new Array(NUMBER_OF_CARDS).fill(0);

        this.handVisability = new Map<number, Map<number, boolean>>();
        this.handAccessibility = new Map<number, boolean>();
        this.deckEditUid = null;

        this.players.forEach((player: IPlayer) => {
            player.coins = 3;
            player.hand.push(...this.lootDeck.splice(0, 3));
            player.field.push(player.characterIndex)
            player.field.push(getEternalCardIdFromCharacterId(player.characterIndex));

            this.handVisability.set(player.uid, new Map<number, boolean>())
            this.handAccessibility.set(player.uid, false);

            this.players.filter((_player: IPlayer) => _player.uid !== player.uid)
                .forEach((_player: IPlayer) => this.handVisability.get(player.uid).set(_player.uid, false));
            this.handVisability.get(player.uid).set(player.uid, true);  // Every player can see their own hand


        })
    }

    performMove(move: IMove) {
        let cardId: number = -1;
        switch (move.sourceType) {
            case DroppableType.Field:
                [cardId] = this.players[move.sourceTypeIndex].field.splice(move.sourceInnerIndex, 1);
                break;
            case DroppableType.Hand:
                [cardId] = this.players[move.sourceTypeIndex].hand.splice(move.sourceInnerIndex, 1);
                break;
            case DroppableType.LootDeck:
                [cardId] = this.lootDeck.splice(move.sourceInnerIndex, 1);
                break;
            case DroppableType.LootDiscard:
                [cardId] = this.discardLootPile.splice(move.sourceInnerIndex, 1);
                break;
            case DroppableType.MonsterDeck:
                [cardId] = this.monsterDeck.splice(move.sourceInnerIndex, 1);
                break;
            case DroppableType.MonsterDiscard:
                [cardId] = this.discardMonsterPile.splice(move.sourceInnerIndex, 1);
                break;
            case DroppableType.MonsterField:
                [cardId] = this.monsterField.splice(move.sourceInnerIndex, 1);
                break;
            case DroppableType.TreasureDeck:
                [cardId] = this.treasureDeck.splice(move.sourceInnerIndex, 1);
                break;
            case DroppableType.TreasureField:
                [cardId] = this.treasureField.splice(move.sourceInnerIndex, 1);
                break;
        }

        switch (move.destinationType) {
            case DroppableType.Field:
                this.players[move.destinationTypeIndex].field.splice(move.destinationInnerIndex, 0, cardId);
                break;
            case DroppableType.Hand:
                this.players[move.destinationTypeIndex].hand.splice(move.destinationInnerIndex, 0, cardId);
                break;
            case DroppableType.LootDeck:
                this.lootDeck.splice(move.destinationInnerIndex, 0, cardId);
                break;
            case DroppableType.LootDiscard:
                this.discardLootPile.splice(move.destinationInnerIndex, 0, cardId);
                break;
            case DroppableType.MonsterDeck:
                this.monsterDeck.splice(move.destinationInnerIndex, 0, cardId);
                break;
            case DroppableType.MonsterDiscard:
                this.discardMonsterPile.splice(move.destinationInnerIndex, 0, cardId);
                break;
            case DroppableType.MonsterField:
                this.monsterField.splice(move.destinationInnerIndex, 0, cardId);
                break;
            case DroppableType.TreasureDeck:
                this.treasureDeck.splice(move.destinationInnerIndex, 0, cardId);
                break;
            case DroppableType.TreasureField:
                this.treasureField.splice(move.destinationInnerIndex, 0, cardId);
                break;
        }
    }

    incrementCentCounter(uid: number): void {
        this.players.find((player: IPlayer) => player.uid == uid).coins++;
    }

    decrementCentCounter(uid: number): void {
        if (this.players.find((player: IPlayer) => player.uid == uid).coins > 0) {
            this.players.find((player: IPlayer) => player.uid == uid).coins--;
        }
    }

    incrementCounter(cardId: number): void {
        this.counterLookup[cardId]++
    }

    decrementCounter(cardId: number): void {
        if (this.counterLookup[cardId] > 0) {
            this.counterLookup[cardId]--;
        }
    }

    resetCard(cardId: number): void {
        this.tiltLookup[cardId] = false;
        this.counterLookup[cardId] = 0;
    }

    setCardTilt(val: boolean, cardId: number) {
        this.tiltLookup[cardId] = val;
    }

    // Returns true if the move changes the game data
    isMoveEffective(move: IMove): boolean {
        return !(move.sourceType == move.destinationType &&
            move.sourceTypeIndex == move.destinationTypeIndex &&
            move.sourceInnerIndex && move.destinationInnerIndex);
    }

    isMoveValid(move: IMove): boolean {
        switch (move.sourceType) {
            case DroppableType.Field:
                return this.players[move.sourceTypeIndex].field[move.sourceInnerIndex] == move.cardId;
            case DroppableType.Hand:
                return this.players[move.sourceTypeIndex].hand[move.sourceInnerIndex] == move.cardId;
            case DroppableType.LootDeck:
                return this.lootDeck[move.sourceInnerIndex] == move.cardId;
            case DroppableType.LootDiscard:
                return this.discardLootPile[move.sourceInnerIndex] == move.cardId;
            case DroppableType.MonsterDeck:
                return this.monsterDeck[move.sourceInnerIndex] == move.cardId;
            case DroppableType.MonsterDiscard:
                return this.discardMonsterPile[move.sourceInnerIndex] == move.cardId;
            case DroppableType.MonsterField:
                return this.monsterField[move.sourceInnerIndex] == move.cardId;
            case DroppableType.TreasureDeck:
                return this.treasureDeck[move.sourceInnerIndex] == move.cardId;
            case DroppableType.TreasureField:
                return this.treasureField[move.sourceInnerIndex] == move.cardId;
        }
    }

    setHandVisability(seerUid: number, seenUid: number, val: boolean) {
        this.handVisability.get(seerUid).set(seenUid, val);
    }

    setHandAccessiblity(uid: number, val: boolean) {
        this.handAccessibility.set(uid, val);
    }

    performGameEdit(edit: IGameEdit) {
        const playerIndex: number = this.players.findIndex((player: IPlayer) => player.uid === edit.uid);

        this.players[playerIndex].hand = edit.playerHand;
        this.players[playerIndex].field = edit.playerField;
        
        this.lootDeck = edit.lootDeck;
        this.discardLootPile = edit.lootDiscard;
        
        this.treasureDeck = edit.treasureDeck;
        this.treasureField = edit.treasureField;
        this.discardTreasurePile = edit.treasureDiscard;
        
        this.monsterDeck = edit.monsterDeck;
        this.monsterField = edit.monsterField;
        this.discardMonsterPile = edit.monsterDiscard;

        this.bonusSoulsDeck = edit.bonusSouls;
    }

    getGameData(): IGameData {
        return {
            players: this.players,

            monsterDeck: this.monsterDeck,
            lootDeck: this.lootDeck,
            treasureDeck: this.treasureDeck,
            bonusSoulsDeck: this.bonusSoulsDeck,

            monsterField: this.monsterField,
            treasureField: this.treasureField,

            tiltLookup: this.tiltLookup,
            counterLookup: this.counterLookup,

            discardLootPile: this.discardLootPile,
            discardMonsterPile: this.discardMonsterPile,
            discardTreasurePile: this.discardTreasurePile,

            deckEditUid: this.deckEditUid,

            handVisibility: Array.from(this.handVisability).map((m: [number, Map<number, boolean>]) => [m[0], Array.from(m[1])]),
            handAccessibility: Array.from(this.handAccessibility),
        }
    }

    setPlayerEdit(uid: number): boolean {
        console.log("Setting player edit")
        if (this.deckEditUid === null) {
            this.deckEditUid = uid;
            return true;
        }

        return false;
    }

    removePlayerEdit(uid: number) {
        if (this.deckEditUid == uid) {
            this.deckEditUid = null;
            return true;
        }
        return false;
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



}