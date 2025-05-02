import axios from 'axios';

const CompleteLiveStream = async (liveStreamId) => {
  console.log(`Completing Live Stream: ${liveStreamId}`);
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

    console.log("Live stream marked as complete.");
    return response.data;

  } catch (error) {
    console.error("Error completing live stream:", error.response?.data || error.message);
    throw error;
  }
};

export default CompleteLiveStream;
