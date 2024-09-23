import React from 'react';
import { ChevronLeft, FileText, HelpCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function CourseHeader() {
  return (
    <div className="flex items-center justify-between bg-gray-800 text-white p-4">
      <div className="flex items-center">
        <Link href="/courses">
          <ChevronLeft className="text-white cursor-pointer" />
        </Link>
        <Image src="/logo.svg" alt="logo" width={40} height={40} className="ml-4" />
        <span className="ml-4 text-lg font-semibold">Lập trình C++ cơ bản, nâng cao</span>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <span className="text-sm">0%</span>
          <span className="ml-2 text-sm">0/138 bài học</span>
        </div>
        <div className="flex items-center mr-4 cursor-pointer">
          <FileText className="text-white" />
          <span className="ml-2 text-sm">Ghi chú</span>
        </div>
        <div className="flex items-center cursor-pointer">
          <HelpCircle className="text-white" />
          <span className="ml-2 text-sm">Hướng dẫn</span>
        </div>
      </div>
    </div>
  );
}

export default CourseHeader;