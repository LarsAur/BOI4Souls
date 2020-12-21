const BASE_IMAGE_URL = "https://pop-life.com/foursouls/data/cards/"
export const NUMBER_OF_PLAYER_CARDS = 10; // 11 with eden
const cardImageUrl:string[] = [
    "001Isaac(1).png",
    "002Cain(1).png",
    "003Maggy(1).png",
    "004Judas(1).png",
    "005Samson(1).png",
    "006Eve(1).png",
    "007Lilith(1).png",
    "008BlueBaby(1).png",
    "009Lazarus(2).png",
    "010TheForgotten(2).png",
    //"011Eden(1).png",
    
    "001D6(2).png",
    "002SleightofHand(2).png",
    "003YumHeart(2).png",
    "004BookofBelial(2).png",
    "005BloodLust(2).png",
    "006TheCurse(2).png",
    "007Incubus(2).png",
    "008ForeverAlone(2).png",
    "009LazarusRags(2).png",
    "010TheBone(2).png",
]

export const getCardURL = (cardId: number):string => {
    return BASE_IMAGE_URL + cardImageUrl[cardId];
}