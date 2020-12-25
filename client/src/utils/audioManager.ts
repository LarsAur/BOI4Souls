export default class AudioManager{
    
    static sounds : Map<string, HTMLAudioElement> = new Map([
        ["dice", new Audio("./audio/DiceRoll.mp3")],
    ]);

    // Starts the audio 
    static play = (key: string) : void => {
        let audio: HTMLAudioElement | undefined = AudioManager.sounds.get(key);
        if(audio){
            audio.play().then(_ => console.log("Playing " + key)).catch(_ => console.error("Could not play " + key));
        }else{
            console.error("The there is not audio with the key " + key);
        }
    }
    
    // Starts the audio from the audioelement and plays it in a loop
    static loop = (key: string) : void => {
        let audio: HTMLAudioElement | undefined = AudioManager.sounds.get(key);
        if(audio){
            audio.loop = true;
            audio.play().then(_ => console.log("Playing " + key)).catch(_ => console.error("Could not play " + key));;
        }else{
            console.error("The there is not audio with the key " + key);
        }
    }

    // Pauses the audio element such that the next time it is played it continuees from where it was paused.
    // This function does not alter the loop attribute like stop()
    static pause = (key: string) : void => {
        let audio: HTMLAudioElement | undefined = AudioManager.sounds.get(key);
        if(audio){
            audio.pause();
        }else{
            console.error("The there is not audio with the key " + key);
        }
    } 

    // Stops the audio from the audioelement with the given key, the next time the audio is played, it will start from the beginning.
    static stop = (key: string) : void => {
        let audio: HTMLAudioElement | undefined = AudioManager.sounds.get(key);
        // If the audio element exists, pause it and set the current time to the beginning.
        // The loop tag is set to false, in case the audio element was looping when stopped.
        if(audio){
            audio.pause();
            audio.currentTime = 0;
            audio.loop = false;
        }else{
            console.error("The there is not audio with the key " + key);
        }
    }

    // Mutes or unmutes all sounds in the audio manager
    static setMuted = (muted: boolean) : void => {
        AudioManager.sounds.forEach(audio => {
            audio.muted = muted;
        });
    }

    // Sets the volume of the audio, the value can be between 0 and 1
    static setVolume = (key:string, volume:number) : void => {
        if(volume > 1 || volume < 0) return;
        let audio: HTMLAudioElement | undefined = AudioManager.sounds.get(key);
        if(audio){
            audio.volume = volume;
        }else{
            console.error("The there is not audio with the key " + key);
        }
    }

    static isPlaying = (key:string) : boolean => {
        let audio: HTMLAudioElement | undefined = AudioManager.sounds.get(key);
        if(audio){
            return !audio.paused
        }else{
            console.error("The there is not audio with the key " + key);
        }
        return false;
    }
}
