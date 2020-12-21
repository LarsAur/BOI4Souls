"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.getEternalCardIdFromCharacterId = exports.getCard = exports.NUMBER_OF_PLAYER_CARDS = exports.CARD_TYPE = void 0;
var CARD_TYPE;
(function (CARD_TYPE) {
    CARD_TYPE[CARD_TYPE["LOOT"] = 0] = "LOOT";
    CARD_TYPE[CARD_TYPE["TREASURE"] = 1] = "TREASURE";
    CARD_TYPE[CARD_TYPE["ETERNAL"] = 2] = "ETERNAL";
    CARD_TYPE[CARD_TYPE["PLAYER"] = 3] = "PLAYER";
})(CARD_TYPE = exports.CARD_TYPE || (exports.CARD_TYPE = {}));
exports.NUMBER_OF_PLAYER_CARDS = 10; // EDEN IS 11
const getCard = (id) => {
    if (id < 0 || id >= cardData.length)
        return null;
    return cards[id];
};
exports.getCard = getCard;
const getEternalCardIdFromCharacterId = (id) => {
    if (id < 0 || id >= exports.NUMBER_OF_PLAYER_CARDS)
        return;
    return id + exports.NUMBER_OF_PLAYER_CARDS;
};
exports.getEternalCardIdFromCharacterId = getEternalCardIdFromCharacterId;
const BASE_IMAGE_URL = "https://pop-life.com/foursouls/data/cards/";
const cardData = [
    // Player cards
    { name: "Isaac", type: CARD_TYPE.PLAYER, urlResName: "001Isaac.png" },
    { name: "Cain", type: CARD_TYPE.PLAYER, urlResName: "002Cain.png" },
    { name: "Maggy", type: CARD_TYPE.PLAYER, urlResName: "003Maggy.png" },
    { name: "Judas", type: CARD_TYPE.PLAYER, urlResName: "004Judas.png" },
    { name: "Samson", type: CARD_TYPE.PLAYER, urlResName: "005Samson.png" },
    { name: "Eve", type: CARD_TYPE.PLAYER, urlResName: "006Eve.png" },
    { name: "Lilith", type: CARD_TYPE.PLAYER, urlResName: "007Lilith.png" },
    { name: "Blue Baby", type: CARD_TYPE.PLAYER, urlResName: "008BlueBaby.png" },
    { name: "Lazarus", type: CARD_TYPE.PLAYER, urlResName: "009Lazarus.png" },
    { name: "The Forgotten", type: CARD_TYPE.PLAYER, urlResName: "010TheForgotten.png" },
    //{ name: "Eden", type: CARD_TYPE.PLAYER, urlResName: "011Eden.png" },
    // Eternal Cards
    { name: "D6", type: CARD_TYPE.ETERNAL, urlResName: "001D6.png" },
    { name: "Sleight of Hand", type: CARD_TYPE.ETERNAL, urlResName: "002SleightofHand.png" },
    { name: "YumHeart", type: CARD_TYPE.ETERNAL, urlResName: "003YumHeart.png" },
    { name: "Book of Belial", type: CARD_TYPE.ETERNAL, urlResName: "004BookofBelial.png" },
    { name: "Bloor Lust", type: CARD_TYPE.ETERNAL, urlResName: "005BlootLust.png" },
    { name: "The Curse", type: CARD_TYPE.ETERNAL, urlResName: "006TheCurse.png" },
    { name: "Incubus", type: CARD_TYPE.ETERNAL, urlResName: "007Incubus.png" },
    { name: "Forever Alone", type: CARD_TYPE.ETERNAL, urlResName: "008ForeverAlone.png" },
    { name: "Lazarus Rag", type: CARD_TYPE.ETERNAL, urlResName: "009LazarusRag.png" },
    { name: "The Bone", type: CARD_TYPE.ETERNAL, urlResName: "010TheBone.png" },
];
class Card {
    // Id corresponds to the index in the cards list
    constructor(id, cardData) {
        this.cardId = id;
        this.name = cardData.name;
        this.imageURL = BASE_IMAGE_URL + cardData.urlResName;
        this.type = cardData.type;
        this.turned = false;
    }
    flip() {
        this.turned = !this.turned;
    }
}
exports.Card = Card;
const cards = cardData.map((cardData, index) => new Card(index, cardData));
//# sourceMappingURL=card.js.map