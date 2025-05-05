"use server"

import axios from 'axios';

const CreateLiveStream = async () => {
  
  try {
    const tokenId = process.env.NEXT_PUBLIC_MUX_TOKEN_ID;
    const tokenSecret = process.env.NEXT_PUBLIC_MUX_TOKEN_SECRET;

    const auth = Buffer.from(`${tokenId}:${tokenSecret}`).toString('base64');

    const response = await axios.post(
      'https://api.mux.com/video/v1/live-streams',
      {
        playback_policy: ['public'],
        new_asset_settings: { playback_policy: ['public'] },
        latency_mode: 'reduced'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        }
      }
    );

    const data = response.data.data;
    const streamKey = data.stream_key;
    const streamid = data.id;
    const playback_ids = data.playback_ids[0]?.id;

    

    return [streamKey, streamid, playback_ids];

  } catch (error) {
    
    throw error;
  }
};

export default CreateLiveStream;
