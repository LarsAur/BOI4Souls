export interface IGameData {
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

    tiltLookup: boolean[];      // indexed by the card id
    counterLookup: number[];    // indexed by the card id
}

export interface IPlayer {
    username: string
    uid: number

    characterIndex: number
    coins: number
    hand: number[] // Ids of the cards in the hand
    field: number[] // Ids of the card in the field
}

export interface IMove {
    sourceType: DroppableType,
    sourceTypeIndex: number,
    sourceInnerIndex: number,

    destinationType: DroppableType,
    destinationTypeIndex: number,   // Index within the type, eg. player 2 hand. should be 1 for non-indexed types such as lootDeck
    destinationInnerIndex: number,  // Index within the list of the droppable, eg. index within player1s hand.

    cardId: number, // used to varify the move
}

export interface ICardTiltRequest {
    cardId: number,
    value: boolean,
}

export enum DroppableType {
    Hand,
    Field,
    TreasureField,
    TreasureDeck,
    LootDeck,
    LootDiscard,
    MonsterDeck,
    MonsterDiscard,
    MonsterField,
}