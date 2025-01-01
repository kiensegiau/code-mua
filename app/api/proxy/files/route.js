export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const part = searchParams.get("part");

  try {
    const response = await fetch(
      `${process.env.API_URL}/files/${id}?part=${part}`,
      {
        headers: {
          Range: `bytes=${part * CHUNK_SIZE}-${(part + 1) * CHUNK_SIZE - 1}`,
        },
      }
    );

    // Trả về chunk dưới dạng ArrayBuffer
    const chunk = await response.arrayBuffer();
    return new Response(chunk, {
      headers: {
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch chunk" },
      { status: 500 }
    );
  }
}
