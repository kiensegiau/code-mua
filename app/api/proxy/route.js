export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');
    
    if (!fileId) {
      return new Response('Missing file ID', { status: 400 });
    }

    // Thêm logging
    console.log('Requesting file:', fileId);
    
    // Logic xử lý và trả về video stream
    // ...

  } catch (error) {
    console.error('Error streaming video:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 