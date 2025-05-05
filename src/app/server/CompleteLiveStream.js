"use server"

import axios from 'axios';

const CompleteLiveStream = async (liveStreamId) => {
  
  try {
    const tokenId = process.env.NEXT_PUBLIC_MUX_TOKEN_ID;
    const tokenSecret = process.env.NEXT_PUBLIC_MUX_TOKEN_SECRET;

    const auth = Buffer.from(`${tokenId}:${tokenSecret}`).toString('base64');

    const response = await axios.put(
      `https://api.mux.com/video/v1/live-streams/${liveStreamId}/complete`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        }
      }
    );

   
    return response.data;

  } catch (error) {
    throw error;
  }
};

export default CompleteLiveStream;
