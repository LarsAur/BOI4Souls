export class Card {

    static nextCardId = 0;

    imageURL: string
    cardId: number

    constructor(imageURL: string) {
        this.imageURL = imageURL;
        this.cardId = Card.nextCardId;
        Card.nextCardId++;
    }

}

export class LootCard extends Card {
    constructor(imageURL: string) {
        super(imageURL);
    }
}

export class TreasureCard extends Card {
    constructor(imageURL: string) {
        super(imageURL);
    }
}

export class EternalCard extends Card {
    constructor(imageURL: string) {
        super(imageURL);
    }
}

export class PlayerCard extends Card {

    eternalCard: EternalCard

    constructor(imageURL: string, eternalCard: EternalCard) {
        super(imageURL);
        this.eternalCard = eternalCard;
    }

}

export const eternalCards = [
    new EternalCard("https://pop-life.com/foursouls/data/cards/008ForeverAlone(3).png"),
    new EternalCard("https://pop-life.com/foursouls/data/cards/002SleightofHand(3).png"),
    new EternalCard("https://pop-life.com/foursouls/data/cards/006TheCurse(4).png"),
    new EternalCard("https://pop-life.com/foursouls/data/cards/001D6(4).png"),
    new EternalCard("https://pop-life.com/foursouls/data/cards/004BookofBelial(3).png"),
    new EternalCard("https://pop-life.com/foursouls/data/cards/009LazarusRags(4).png"),
    new EternalCard("https://pop-life.com/foursouls/data/cards/007Incubus(4).png"),
    new EternalCard("https://pop-life.com/foursouls/data/cards/003YumHeart(4).png"),
    new EternalCard("https://pop-life.com/foursouls/data/cards/005BloodLust(4).png"),
    new EternalCard("https://pop-life.com/foursouls/data/cards/010TheBone(3).png"),

]

export const playerCards = [
    new PlayerCard("https://pop-life.com/foursouls/data/cards/008BlueBaby(1).png", eternalCards[0]),
    new PlayerCard("https://pop-life.com/foursouls/data/cards/002Cain(1).png", eternalCards[1]),
    new PlayerCard("https://pop-life.com/foursouls/data/cards/006Eve(1).png", eternalCards[2]),
    new PlayerCard("https://pop-life.com/foursouls/data/cards/001Isaac(1).png", eternalCards[3]),
    new PlayerCard("https://pop-life.com/foursouls/data/cards/004Judas(1).png", eternalCards[4]),
    new PlayerCard("https://pop-life.com/foursouls/data/cards/009Lazarus(2).png", eternalCards[5]),
    new PlayerCard("https://pop-life.com/foursouls/data/cards/007Lilith(1).png", eternalCards[6]),
    new PlayerCard("https://pop-life.com/foursouls/data/cards/003Maggy(2).png", eternalCards[7]),
    new PlayerCard("https://pop-life.com/foursouls/data/cards/005Samson(1).png", eternalCards[8]),
    new PlayerCard("https://pop-life.com/foursouls/data/cards/010TheForgotten(3).png", eternalCards[9]),
    new PlayerCard("https://pop-life.com/foursouls/data/cards/011Eden(1).png", null),
]
