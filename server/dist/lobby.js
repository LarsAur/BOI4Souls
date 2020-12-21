"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("./card");
class BOILobby {
    constructor() {
        this.players = [];
    }
    addPlayer(username) {
        let uid = BOILobby.nextUid;
        BOILobby.nextUid++;
        this.players.push({
            username: username,
            uid: uid,
            characterIndex: -1,
            hand: []
        });
        this.incrementPlayerCharacter(uid); // Set character to the first available character
        console.log(username, "was added to lobby. CharacterIndex:", this.getPlayer(uid).characterIndex);
        return uid;
    }
    removePlayer(uid) {
        this.players = this.players.filter((player) => player.uid != uid);
    }
    getPlayer(uid) {
        return this.players.find((player) => player.uid == uid);
    }
    getPlayers() {
        return this.players;
    }
    incrementPlayerCharacter(uid) {
        let player = this.getPlayer(uid);
        if (!player)
            return;
        player.characterIndex = (player.characterIndex + 1) % card_1.NUMBER_OF_PLAYER_CARDS;
        // Loop until there is not other player with the character index
        while (this.players.find((_player) => _player.characterIndex == player.characterIndex && _player.uid != player.uid)) {
            player.characterIndex = (player.characterIndex + 1) % card_1.NUMBER_OF_PLAYER_CARDS;
        }
    }
    decrementPlayerCharacter(uid) {
        let player = this.getPlayer(uid);
        if (!player)
            return;
        player.characterIndex = (player.characterIndex - 1 + card_1.NUMBER_OF_PLAYER_CARDS) % card_1.NUMBER_OF_PLAYER_CARDS;
        // Loop until there is not other player with the character index
        while (this.players.find((_player) => _player.characterIndex == player.characterIndex && _player.uid != player.uid)) {
            player.characterIndex = (player.characterIndex - 1 + card_1.NUMBER_OF_PLAYER_CARDS) % card_1.NUMBER_OF_PLAYER_CARDS;
        }
    }
    isSpace() {
        return this.players.length < 4;
    }
}
exports.default = BOILobby;
BOILobby.nextUid = 0;
//# sourceMappingURL=lobby.js.map