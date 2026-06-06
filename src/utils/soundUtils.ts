export const playClickSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // First high note (bell tone)
    const playNote = (freq: number, startTime: number, duration: number, volume: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    
    // Play a tiny harmonic chime (two fast, sweet notes)
    const now = ctx.currentTime;
    playNote(1320, now, 0.25, 0.03); // E6
    playNote(1760, now + 0.04, 0.35, 0.02); // A6 (perfect fourth higher, nice bell resonance)
  } catch (e) {
    // Fail silently in environments blocking AudioContext without user action
  }
};

