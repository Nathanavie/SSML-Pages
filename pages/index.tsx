import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useSpeech from '@/hooks/useSpeech';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';

export default function Home() {
  const [ssmlString, setSsmlString] = useState<string>('');
  const { play, pause, loading, audio, loadAudio, currentTime, duration } =
    useSpeech(ssmlString);

  const progress = (currentTime / duration) * 100;

  return (
    <main>
      <p>SSML</p>
      <Input
        type='text'
        value={ssmlString}
        onChange={(e) => setSsmlString(e.target.value)}
      />
      <Button onClick={play} disabled={!audio || loading}>
        Play
      </Button>
      <Button onClick={pause} disabled={!audio || loading}>
        Pause
      </Button>
      <Button onClick={loadAudio} disabled={loading}>
        Load More
      </Button>
      <p>Current Time: {currentTime.toFixed(2)}</p>
      <p>Duration: {duration.toFixed(2)}</p>
      <Progress value={progress} />
    </main>
  );
}
