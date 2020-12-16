
interface player {
    username: string
    uid: number
    playerCharacter: card[]
    hand: card[]
}

interface card {
    imageURL : string

}

export default class BOIGame {

    players: player[];

    constructor() {
        this.players = [];
    }



}