import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Kiểm tra id
    if (!id) {
      console.error("Missing file ID in metadata request");
      return NextResponse.json(
        { error: "Missing file ID" },
        { status: 400 }
      );
    }

    console.log("Fetching metadata for ID:", id);

    const response = await fetch(`http://localhost:3000/api/proxy/files/metadata?id=${id}`);
    
    if (!response.ok) {
      console.error("Metadata API error:", response.status);
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Metadata response:", data);

    return NextResponse.json({
      parts: data.parts || 1,
      duration: data.duration || 0,
      type: data.mimeType || 'video/mp4',
      codecs: data.codecs || 'avc1.42E01E,mp4a.40.2',
      chunkSize: data.chunkSize || 16 * 1024 * 1024,
      totalSize: data.size || 0,
      name: data.name || 'video'
    });

  } catch (error) {
    console.error('Metadata fetch error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
