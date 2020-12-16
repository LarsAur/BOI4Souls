import { PlayerCard, playerCards } from './card';

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

        this.getNextAvailableCharacterIndex(uid);

        return uid;
    }

    getPlayer(uid: number): IPlayer{
        return this.players.find((player:IPlayer) => player.uid)
    }

    isSpace(): boolean {
        return this.players.length < 4;
    }

    getNextAvailableCharacterIndex(uid:number): number {
        const player = this.getPlayer(uid);
        player.characterIndex = (player.characterIndex + 1) % playerCards.length;
        while(this.players.find((_player:IPlayer) => _player.characterIndex == player.characterIndex && _player.uid != player.uid)){
            player.characterIndex = (player.characterIndex + 1) % playerCards.length;
        }
        return player.characterIndex;
    }
} 