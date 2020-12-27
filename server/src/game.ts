import {IPlayer} from './lobby';
import {cards, getAllBonusCards, getAllMonsterCards, getAllLootCards, getAllTreasureCards, getEternalCardIdFromCharacterId} from './card';

export interface IGameData{
    players: IPlayer[];

    monsterDeck : number[];
    lootDeck : number[];
    treasureDeck: number[];
    bonusSoulsDeck: number[];
}

export default class BOIGame {

    players: IPlayer[];

    monsterDeck : number[];
    lootDeck : number[];
    treasureDeck: number[];
    bonusSoulsDeck: number[];

    constructor(players: IPlayer[]) {
        this.players = players;

        this.monsterDeck = BOIGame.inplaceShuffle(getAllMonsterCards());
        this.lootDeck = BOIGame.inplaceShuffle(getAllLootCards());
        this.treasureDeck = BOIGame.inplaceShuffle(getAllTreasureCards());
        this.bonusSoulsDeck = getAllBonusCards();

        this.players.forEach((player:IPlayer) => {
            player.coins = 3;
            player.hand.push(...this.lootDeck.splice(0, 3));
            player.field.push(player.characterIndex)
            player.field.push(getEternalCardIdFromCharacterId(player.characterIndex));
        })
    }

    getGameData():IGameData{
        return {
            players: this.players,
            
            monsterDeck: this.monsterDeck,
            lootDeck: this.lootDeck,
            treasureDeck: this.treasureDeck,
            bonusSoulsDeck: this.bonusSoulsDeck,
        }
    }


    static inplaceShuffle(deck:any[]):any[]{
        let m = deck.length;
        let t;
        let i;

        while(m !== 0){
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