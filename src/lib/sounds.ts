/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple base64 encoded UI sounds for immediate usage
const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Simple click
  pop: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',   // Soft pop
  glass: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3', // Glassy sound
};

class SoundManager {
  private static instance: SoundManager;
  private audioCache: Map<string, HTMLAudioElement> = new Map();

  private constructor() {}

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public play(soundName: keyof typeof SOUNDS) {
    try {
      let audio = this.audioCache.get(soundName);
      if (!audio) {
        audio = new Audio(SOUNDS[soundName]);
        audio.volume = 0.2;
        this.audioCache.set(soundName, audio);
      }
      
      // Clone to allow overlapping sounds
      const playAudio = audio.cloneNode() as HTMLAudioElement;
      playAudio.volume = audio.volume;
      playAudio.play().catch(err => console.debug('Audio play blocked:', err));
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }
}

export const playSound = (sound: keyof typeof SOUNDS) => {
  SoundManager.getInstance().play(sound);
};
