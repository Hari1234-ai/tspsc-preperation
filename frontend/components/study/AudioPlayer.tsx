"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Headphones,
  Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  url: string;
  title?: string;
  themeColor: string;
}

export default function AudioPlayer({ url, title = "Audio Explanation", themeColor }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleSpeed = () => {
    const rates = [1, 1.5, 2];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="p-6 md:p-8 rounded-[2rem] border-2 bg-card shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2"
      style={{ borderColor: themeColor + '20' }}
    >
      <audio ref={audioRef} src={url} />
      
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div 
            className="h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: themeColor }}
          >
            <Headphones className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black tracking-tight">{title}</h3>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <span className={cn(isPlaying && "animate-pulse")} style={{ color: isPlaying ? themeColor : undefined }}>
                {isPlaying ? "Playing" : "Paused"}
              </span>
              <span className="opacity-20">•</span>
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSpeed}
            className="h-10 w-14 rounded-xl bg-secondary hover:bg-secondary/80 text-[10px] font-black uppercase tracking-widest transition-all border border-border/50"
          >
            {playbackRate}x
          </button>
          
          <button 
            onClick={togglePlay}
            className="h-14 w-14 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: themeColor }}
          >
            {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-1" />}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {/* Progress Bar */}
        <div className="relative group">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={onSeek}
            className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer accent-current"
            style={{ color: themeColor }}
          />
          <div 
            className="absolute top-0 left-0 h-1.5 rounded-full pointer-events-none transition-all"
            style={{ 
              width: `${(currentTime / duration) * 100}%`,
              backgroundColor: themeColor 
            }}
          />
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => skip(-5)}
            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
             <Volume2 className="h-3 w-3" />
             High Fidelity Audio
          </div>

          <button 
            onClick={() => skip(5)}
            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCw className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
