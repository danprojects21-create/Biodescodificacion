
import React, { useState, useEffect } from 'react';

interface VoicePlayerProps {
  base64Audio: string | null;
  onFinished?: () => void;
}

const VoicePlayer: React.FC<VoicePlayerProps> = ({ base64Audio, onFinished }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!base64Audio) return;

    const playAudio = async () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const decode = (base64: string) => {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      };

      const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
        const dataInt16 = new Int16Array(data.buffer);
        const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
        }
        return buffer;
      };

      try {
        setIsPlaying(true);
        const bytes = decode(base64Audio);
        const audioBuffer = await decodeAudioData(bytes, audioContext);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => {
          setIsPlaying(false);
          if (onFinished) onFinished();
        };
        source.start();
      } catch (err) {
        console.error("Audio playback error", err);
        setIsPlaying(false);
      }
    };

    playAudio();
  }, [base64Audio]);

  if (!base64Audio) return null;

  return (
    <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-teal-100 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex space-x-1">
        <span className="w-1 h-3 bg-teal-500 rounded-full animate-[pulse_1s_infinite]"></span>
        <span className="w-1 h-3 bg-teal-400 rounded-full animate-[pulse_1.2s_infinite]"></span>
        <span className="w-1 h-3 bg-teal-300 rounded-full animate-[pulse_0.8s_infinite]"></span>
      </div>
      <span className="text-xs font-bold text-teal-800 uppercase tracking-widest">
        {isPlaying ? 'Escuchando Voz...' : 'Voz Finalizada'}
      </span>
    </div>
  );
};

export default VoicePlayer;
