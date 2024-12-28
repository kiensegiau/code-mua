"use client";
import { useEffect, useState } from "react";
import { Collapse, Button, List } from "antd";
import {
  PlayCircleOutlined,
  QuestionCircleOutlined,
  UnorderedListOutlined,
  ClockCircleOutlined,
  LaptopOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
// Đảm bảo rằng bạn đã cấu hình Tailwind CSS
import Header from "../../_components/Header";
import Sidebar from "../../_components/SideNav";
import { useAuth } from "@/app/_context/AuthContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import { toast } from "sonner";
import CourseEnrollSection from "./_components/CourseEnrollSection";
import Image from "next/image";

function WatchCourse({ params }) {
  const [courseInfo, setCourseInfo] = useState(null);
  const { user } = useAuth();
  const [isUserEnrolled, setIsUserEnrolled] = useState(false);
  console.log("aaa");

  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
        const course = await GlobalApi.getCourseById(params.courseId);
        setCourseInfo(course);
        console.log("Dữ liệu khóa học:", course);
        if (course && course.chapters) {
          console.log("Dữ liệu các chương:", course.chapters);
          course.chapters.forEach((chapter, index) => {
            // console.log(`Chương ${index + 1}:`, chapter);
            if (chapter.lessons && Array.isArray(chapter.lessons)) {
              // console.log(`Bài học trong chương ${index + 1}:`, chapter.lessons);
            }
          });
        }
        if (user) {
          const enrolled = await GlobalApi.isUserEnrolled(user.uid, params.courseId);
          setIsUserEnrolled(enrolled);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khóa học:", error);
        toast.error("Không thể tải thông tin khóa học");
      }
    };

    fetchCourseInfo();
  }, [params.courseId, user]);

  if (!courseInfo) {
    return <div>Đang tải...</div>;
  }
  console.log(courseInfo);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-col md:flex-row justify-center p-5 bg-white flex-1">
          <div className="w-full md:w-2/3 p-6 mr-0 md:mr-4 mb-4 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">{courseInfo.title}</h1>

            <h2 className="text-2xl font-bold mb-4">Mô tả khoá học</h2>
            <div
              dangerouslySetInnerHTML={{ __html: courseInfo.description }}
              className="prose max-w-none mb-4"
            />
            {/*
            {courseInfo && courseInfo.chapters ? (
              <p className="text-gray-600 mb-4">
                {courseInfo.chapters.length} chương • 
                {courseInfo.chapters.reduce((acc, chapter) => acc + (chapter.lessons && Array.isArray(chapter.lessons) ? chapter.lessons.length : 0), 0)} bài học • 
                Thời lượng {courseInfo.duration || 'Chưa xác định'}
              </p>
            ) : (
              <p className="text-gray-600 mb-4">Đang tải nội dung khóa học...</p>
            )} */}
            {/* <Collapse 
              accordion 
              expandIconPosition="end"
              onChange={(key) => handleChapterClick(key[0] !== undefined ? Number(key[0]) : null)}
            >
              {courseInfo.chapters && courseInfo.chapters.map((chapter, index) => (
                <Panel
                  header={
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{`${index + 1}. ${chapter.title}`}</span>
                      <span className="text-gray-500">
                        {chapter.lessons && Array.isArray(chapter.lessons) ? `${chapter.lessons.length} bài học` : 'Không c�� bài học'}
                      </span>
                    </div>
                  }
                  key={index}
                >
                  {chapter.lessons && Array.isArray(chapter.lessons) ? (
                    <List
                      itemLayout="horizontal"
                      dataSource={chapter.lessons}
                      renderItem={(lesson, lessonIndex) => (
                        <List.Item
                          onClick={() => handleLessonClick(index, lessonIndex, lesson)}
                          className={`cursor-pointer hover:bg-gray-100 ${
                            activeLesson && activeLesson.id === lesson.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <List.Item.Meta
                            avatar={<PlayCircleOutlined className={`${
                              activeLesson && activeLesson.id === lesson.id ? 'text-blue-500' : 'text-gray-400'
                            }`} />}
                            title={
                              <div className="flex justify-between">
                                <span>{lesson.title}</span>
                                <span className="text-gray-400">{lesson.duration || 'N/A'}</span>
                              </div>
                            }
                            description={
                              <div className="text-sm text-gray-500">
                                {lesson.description && lesson.description.length > 100
                                  ? `${lesson.description.substring(0, 100)}...`
                                  : lesson.description}
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
            </Collapse> */}
          </div>

          <div className="w-full md:w-1/3">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden rounded-2xl shadow-lg max-w-[428px] mx-auto border-4 border-white">
              <div className="relative aspect-[16/9]">
                {courseInfo.previewImageUrl && (
                  <Image
                    src={courseInfo.previewImageUrl}
                    alt={courseInfo.title}
                    layout="fill"
                    objectFit="cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    <PlayCircleOutlined className="text-3xl text-blue-500" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent">
                  <h2 className="text-2xl font-bold mb-1">
                    {courseInfo.title}
                  </h2>
                  <p className="text-lg">Xem giới thiệu khóa học</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 flex flex-col items-center">
              <h3 className="text-3xl font-normal text-orange-500 mb-4 text-center">
                {courseInfo.price > 0
                  ? `${courseInfo.price.toLocaleString()} VND`
                  : "Miễn phí"}
              </h3>
              <CourseEnrollSection
                courseInfo={courseInfo}
                isUserAlreadyEnrolled={isUserEnrolled}
              />
              <ul className="list-none pl-[5.5rem] pr-4 py-2 text-gray-600 w-full">
                <li className="mb-2 flex items-center">
                  <span className="mr-2 text-gray-400 font-bold text-lg">
                    <QuestionCircleOutlined />
                  </span>
                  {courseInfo.level}
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2 text-gray-400 font-bold text-lg">
                    <UnorderedListOutlined />
                  </span>
                  <span>
                    Tổng số <strong>{courseInfo.totalLessons}</strong> bài học
                  </span>
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2 text-gray-400 font-bold text-lg">
                    <ClockCircleOutlined />
                  </span>
                  <span>
                    Thời lượng <strong>{courseInfo.duration}</strong>
                  </span>
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
