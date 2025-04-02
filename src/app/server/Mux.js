"use server"
import axios from 'axios';
const MuxGetUrlFunc = async()=>{
const upload = await axios.post(
    'https://api.mux.com/video/v1/uploads',
    {
      "new_asset_settings": {
  "playback_policy": [
    "public"
  ],
  "max_resolution_tier": "1080p",
  "encoding_tier": "baseline"
},
"cors_origin": "*"
    },
    {
      auth: {
        username: process.env.NEXT_PUBLIC_MUX_TOKEN_ID,
        password: process.env.NEXT_PUBLIC_MUX_TOKEN_SECRET,
      },
    }
  );

  const uploadUrl = upload.data.data.url;
  return [uploadUrl ,upload.data.data.id];
}
export default MuxGetUrlFunc;