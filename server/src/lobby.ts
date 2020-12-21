import {NUMBER_OF_PLAYER_CARDS} from './card'; 

interface IPlayer {
    username: string
    uid: number

    characterIndex: number
    hand: any[] // TODO
}

export default class BOILobby {

    players: IPlayer[]

    static nextUid = 0;

    constructor() {
        this.players = []
    }

    addPlayer(username: string): number {
        let uid = BOILobby.nextUid;
        BOILobby.nextUid++;

        this.players.push({
            username: username,
            uid: uid,
            characterIndex: -1,

            hand:[]
        });

        this.incrementPlayerCharacter(uid) // Set character to the first available character

        console.log(username, "was added to lobby. CharacterIndex:", this.getPlayer(uid).characterIndex)

        return uid;
    }

    removePlayer(uid: number){
        this.players = this.players.filter((player:IPlayer) => player.uid != uid);
    }

    getPlayer(uid: number): IPlayer{
        return this.players.find((player:IPlayer) => player.uid == uid)
    }

    getPlayers(){
        return this.players
    }

    incrementPlayerCharacter(uid:number){
        let player = this.getPlayer(uid);
        if(!player) return;
        player.characterIndex = (player.characterIndex + 1) % NUMBER_OF_PLAYER_CARDS;
        // Loop until there is not other player with the character index
        while(this.players.find((_player:IPlayer) => _player.characterIndex == player.characterIndex && _player.uid != player.uid)){
            player.characterIndex = (player.characterIndex + 1) % NUMBER_OF_PLAYER_CARDS;
        }
    }

    decrementPlayerCharacter(uid:number){
        let player = this.getPlayer(uid);
        if(!player) return;
        player.characterIndex = (player.characterIndex - 1 + NUMBER_OF_PLAYER_CARDS) % NUMBER_OF_PLAYER_CARDS;
        // Loop until there is not other player with the character index
        while(this.players.find((_player:IPlayer) => _player.characterIndex == player.characterIndex && _player.uid != player.uid)){
            player.characterIndex = (player.characterIndex - 1 + NUMBER_OF_PLAYER_CARDS) % NUMBER_OF_PLAYER_CARDS;
        }
    }

    isSpace(): boolean {
        return this.players.length < 4;
    }
} 