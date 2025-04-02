"use server"
import axios from 'axios';
const FetchAsset = async( assetId)=>{
    const asset = await axios.get(
        `https://api.mux.com/video/v1//uploads/${assetId}`,
        {
          auth: {
            username: process.env.NEXT_PUBLIC_MUX_TOKEN_ID,
            password: process.env.NEXT_PUBLIC_MUX_TOKEN_SECRET,
          },
        }
      );
      return [asset.data.asset_id,asset.data.data.asset_id];
}
const FetchAssetDetails = async(assetid)=>{
    const assetdetails = await axios.get(
        `https://api.mux.com/video/v1//assets/${assetid}`,
        {
          auth: {
            username: process.env.NEXT_PUBLIC_MUX_TOKEN_ID,
            password: process.env.NEXT_PUBLIC_MUX_TOKEN_SECRET,
          },
        }
      );
        return [assetdetails.data.data.id,assetdetails.data.data.playback_ids[0].id];
}
export {FetchAsset,FetchAssetDetails};
