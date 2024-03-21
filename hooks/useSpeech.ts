import { useEffect, useRef, useState } from 'react';

const useSpeech = (ssmlString: string) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadAudio = async () => {
    setLoading(true);
    const res = await fetch('/api/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ssml: ssmlString }),
    });
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const mimeType = res.headers.get('Content-Type') || 'audio/mpeg';
    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    setAudio(audio);
    setLoading(false);
  };

  useEffect(() => {
    if (!audio) {
      loadAudio();
    }
  }, [audio]);

  const play = () => {
    if (!audio) return;
    audio.play();
    if (intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(audio.currentTime);
      }, 10);
    }
  };

  const pause = () => {
    if (!audio) return;
    audio.pause();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return { play, pause, loading, audio, loadAudio, duration, currentTime };
};
export default useSpeech;
