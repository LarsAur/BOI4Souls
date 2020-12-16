import {NUMBER_OF_PLAYER_CARDS} from './card'; 

interface IPlayer {
    username: string
    uid: number

    characterIndex: number
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
        });

        return uid;
    }

    getPlayer(uid: number): IPlayer{
        return this.players.find((player:IPlayer) => player.uid)
    }

    incrementPlayerCharacter(uid:number){
        let player = this.getPlayer(uid);
        if(!player) return;
        player.characterIndex = (player.characterIndex + 1) % NUMBER_OF_PLAYER_CARDS;
        while(this.players.find((_player:IPlayer) => _player.characterIndex == player.characterIndex )){
            player.characterIndex = (player.characterIndex + 1) % NUMBER_OF_PLAYER_CARDS;
        }
    }

    isSpace(): boolean {
        return this.players.length < 4;
    }
} 