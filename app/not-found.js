import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Image
        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
        alt="404 Not Found"
        width={600}
        height={480}
        className="mb-8"
      />
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Oops! Trang không tồn tại</h1>
      <p className="text-xl text-gray-600 mb-8">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <Link href="/" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
        Trở về trang chủ
      </Link>
    </div>
  );
}