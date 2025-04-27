
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import AuthorizeMd from '../../../../../middleware/AuthorizeMd';
import { headers } from 'next/headers';
// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    // Check if the request is authorized
    const headerlist = await headers();
    const token = headerlist.get('token');
    const auth = AuthorizeMd(token);
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Get file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Clean up the filename by replacing spaces with underscores
    const cleanFileName = file.name.replace(/\s+/g, '_');
    
    // Create a unique filename with UUID prefix
    const uniqueFileName = `${uuidv4()}-${cleanFileName}`;
    const key = `uploads/${uniqueFileName}`;
    
    // Prepare S3 upload parameters
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    };
    
    // Create command to upload file
    const command = new PutObjectCommand(params);
    
    // Execute upload to S3
    await s3Client.send(command);
    
    // Generate public URL for the uploaded file
    // Using encodeURIComponent to ensure the URL is properly formatted
    const encodedKey = encodeURIComponent(key);
    // S3 URLs actually handle URL encoding in a specific way, where path segments are encoded individually
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodedKey.replace(/%2F/g, '/')}`;
    
    // Return success response with the URL
    return NextResponse.json({
      success: true,
      url: fileUrl,
      key: key,
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// Note: The config option below is not needed in App Router
// The bodyParser property is automatically handled in route handlers