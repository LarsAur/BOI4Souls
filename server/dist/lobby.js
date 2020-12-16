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
        });
        return uid;
    }
    getPlayer(uid) {
        return this.players.find((player) => player.uid);
    }
    incrementPlayerCharacter(uid) {
        let player = this.getPlayer(uid);
        if (!player)
            return;
        player.characterIndex = (player.characterIndex + 1) % card_1.NUMBER_OF_PLAYER_CARDS;
        while (this.players.find((_player) => _player.characterIndex == player.characterIndex)) {
            player.characterIndex = (player.characterIndex + 1) % card_1.NUMBER_OF_PLAYER_CARDS;
        }
    }
    isSpace() {
        return this.players.length < 4;
    }
}
exports.default = BOILobby;
BOILobby.nextUid = 0;
//# sourceMappingURL=lobby.js.map