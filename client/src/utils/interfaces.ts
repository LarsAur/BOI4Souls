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

    deckEditUid: number | null; // uid of the player who has locked the deck

    // Can person 1 see person 2's hand
    handVisibility: [number, [number, boolean][]][]  //(Player who sees, the player who can be seen) 
    handAccessibility: [number, boolean][] // Can other players pull cards from a players hand
}

export const handAccessibilityToMap = (handAccessability: [number, boolean][]):Map<number, boolean> => {
    return new Map(handAccessability)
}

export const handVisibilityToMap = (handVisibility: [number, [number, boolean][]][]): Map<number, Map<number, boolean>> => {
    return new Map(handVisibility.map((e:[number, [number, boolean][]]) => [e[0], new Map(e[1])]))
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

export interface IHandVisabilityRequest {
    seerUid: number,
    value: boolean,
}

export interface IHandAccessibilityRequest {
    value: boolean
}

export interface IGameEdit {
    uid: number,
    playerHand: number[],
    playerField: number[],

    lootDeck: number[],
    lootDiscard: number[],
    treasureDeck: number[],
    treasureDiscard: number[],
    treasureField: number[],
    monsterDeck: number[],
    monsterDiscard: number[],
    monsterField: number[],
    bonusSouls: number[],
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