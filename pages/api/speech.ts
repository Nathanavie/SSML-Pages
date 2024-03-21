import textToSpeech from '@google-cloud/text-to-speech';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  const client = new textToSpeech.TextToSpeechClient();
  const ssml = `<speak>${
    req.body.ssml || 'This is a text to speech string'
  }</speak>`;
  const [response] = await client.synthesizeSpeech({
    input: { ssml: ssml },
    voice: {
      languageCode: 'en-US',
      ssmlGender: 'FEMALE',
      name: 'calm',
    },
    audioConfig: { audioEncoding: 'MP3' },
  });
  res.setHeader('Content-Type', 'audio/mpeg');
  res.send(Buffer.from(response.audioContent as Uint8Array));
}
