"use client";
import { useEffect, useState } from "react";
import { Collapse, Button, List } from "antd";
import { PlayCircleOutlined, QuestionCircleOutlined, UnorderedListOutlined, ClockCircleOutlined, LaptopOutlined, CheckOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
// Đảm bảo rằng bạn đã cấu hình Tailwind CSS
import Header from "../../_components/Header";
import Sidebar from "../../_components/SideNav";
import { useAuth } from '@/app/_context/AuthContext';
import GlobalApi from '@/app/_utils/GlobalApi';
import { toast } from "sonner";
import CourseVideoPlayer from './components/CourseVideoPlayer';

const { Panel } = Collapse;

function WatchCourse({ params }) {
  const [courseInfo, setCourseInfo] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
        const course = await GlobalApi.getCourseById(params.courseId);
        setCourseInfo(course);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khóa học:", error);
        toast.error("Không thể tải thông tin khóa học");
      }
    };

    fetchCourseInfo();
  }, [params.courseId]);

  const fakeCourseData = {
    id: "1",
    title: "Lập trình C++ cơ bản, nâng cao",
    description:
      "Khóa học lập trình C++ từ cơ bản tới nâng cao dành cho người mới bắt đầu. Mục tiêu của khóa học này nhằm giúp các bạn nắm được các khái niệm căn cơ của lập trình, giúp các bạn có nền tảng vững chắc để chinh phục con đường trở thành một lập trình viên.",
    chapters: [
      {
        id: "chapter1",
        title: "Giới thiệu",
        order: 1,
        lessons: [
          {
            id: "lesson1",
            title: "Giới thiệu khóa học",
            duration: "01:03",
            order: 1,
          },
          {
            id: "lesson2",
            title: "Cài đặt Dev - C++",
            duration: "02:31",
            order: 2,
          },
          {
            id: "lesson3",
            title: "Hướng dẫn sử dụng Dev - C++",
            duration: "03:33",
            order: 3,
          },
        ],
      },
      {
        id: "chapter2",
        title: "Biến và kiểu dữ liệu",
        order: 2,
        lessons: [
          { id: "lesson4", title: "Biến là gì?", duration: "04:00", order: 1 },
          {
            id: "lesson5",
            title: "Kiểu dữ liệu trong C++",
            duration: "05:00",
            order: 2,
          },
        ],
      },
      // Thêm các chương và bài học giả khác nếu cần
    ],
  };

  const handleLessonClick = (lesson) => {
    setActiveLesson(lesson);
    // Thêm logic để cập nhật URL hoặc state nếu cần
  };

  if (!courseInfo) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-col md:flex-row justify-center p-5 bg-white flex-1">
          <div className="w-full md:w-2/3 p-6 mr-0 md:mr-4 mb-4 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">{courseInfo.title}</h1>
            <p className="text-gray-600 mb-6">{courseInfo.description}</p>
            
            <h2 className="text-2xl font-bold mb-4">Bạn sẽ học được gì?</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
              {/* Thêm danh sách các điểm học được */}
              <li className="flex items-center">
                <CheckOutlined className="text-green-500 mr-2" />
                Hiểu chi tiết về các khái niệm cơ bản trong JS
              </li>
              {/* Thêm các mục khác tương tự */}
            </ul>

            <h2 className="text-2xl font-bold mb-4">Nội dung khóa học</h2>
            {courseInfo && courseInfo.chapters ? (
              <>
                <p className="text-gray-600 mb-4">
                  {courseInfo.chapters.length} chương • 
                  {courseInfo.chapters.reduce((acc, chapter) => acc + (chapter.lessons && Array.isArray(chapter.lessons) ? chapter.lessons.length : 0), 0)} bài học • 
                  Thời lượng {courseInfo.duration || 'Chưa xác định'}
                </p>
                <Collapse accordion expandIconPosition="end">
                  {courseInfo.chapters.map((chapter, index) => (
                    <Panel
                      header={
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{`${index + 1}. ${chapter.title}`}</span>
                          <span className="text-gray-500">
                            {chapter.lessons && Array.isArray(chapter.lessons) ? `${chapter.lessons.length} bài học` : 'Không có bài học'}
                          </span>
                        </div>
                      }
                      key={chapter.id}
                    >
                      {chapter.lessons && Array.isArray(chapter.lessons) ? (
                        <List
                          itemLayout="horizontal"
                          dataSource={chapter.lessons}
                          renderItem={(lesson) => (
                            <List.Item
                              onClick={() => handleLessonClick(lesson)}
                              className="cursor-pointer hover:bg-gray-100"
                            >
                              <List.Item.Meta
                                avatar={<PlayCircleOutlined className="text-gray-400" />}
                                title={
                                  <div className="flex justify-between">
                                    <span>{lesson.title}</span>
                                    <span className="text-gray-400">{lesson.duration}</span>
                                  </div>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      ) : (
                        <p>Không có bài học trong chương này.</p>
                      )}
                    </Panel>
                  ))}
                </Collapse>
              </>
            ) : (
              <p className="text-gray-600 mb-4">Đang tải nội dung khóa học...</p>
            )}
          </div>
          
          <div className="w-full md:w-1/3">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden rounded-2xl shadow-lg max-w-[428px] mx-auto border-4 border-white">
              <div className="relative aspect-[16/9]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    <PlayCircleOutlined className="text-3xl text-blue-500" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent">
                  <h2 className="text-2xl font-bold mb-1">JavaScript</h2>
                  <p className="text-lg">Xem giới thiệu khóa học</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 flex flex-col items-center">
              <h3 className="text-3xl font-normal text-orange-500 mb-4 text-center">Miễn phí</h3>
              <Button 
                type="primary" 
                size="large" 
                className="w-3/4 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
              >
                Đăng ký ngay
              </Button>
              <ul className="list-none pl-[5.5rem] pr-4 py-2 text-gray-600 w-full">
                <li className="mb-2 flex items-center">
                  <span className="mr-2 text-gray-400 font-bold text-lg">
                    <QuestionCircleOutlined />
                  </span>
                  Trình độ trung bình
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2 text-gray-400 font-bold text-lg">
                    <UnorderedListOutlined />
                  </span>
                  <span>Tổng số <strong>29</strong> bài học</span>
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2 text-gray-400 font-bold text-lg">
                    <ClockCircleOutlined />
                  </span>
                  <span>Thời lượng  <strong>09 giờ 00 phút</strong></span>
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2 text-gray-400 font-bold text-lg">
                    <LaptopOutlined />
                  </span>
                  Học mọi lúc, mọi nơi
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchCourse;
