"use client";
import { useEffect, useState } from "react";
import { Collapse, List, Spin } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { PlayCircleOutlined, QuestionCircleOutlined, UnorderedListOutlined, ClockCircleOutlined, LaptopOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import Header from "../../_components/Header";
import Sidebar from "../../_components/SideNav";
import GlobalApi from '@/app/_utils/GlobalApi';
import { toast } from "sonner";
import CourseVideoPlayer from './components/CourseVideoPlayer';

const { Panel } = Collapse;

function WatchCourse({ params }) {
  const [courseInfo, setCourseInfo] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
        setLoading(true);
        const course = await GlobalApi.getCourseById(params.courseId);
        setCourseInfo(course);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khóa học:", error);
        toast.error("Không thể tải thông tin khóa học");
        setLoading(false);
      }
    };

    fetchCourseInfo();
  }, [params.courseId]);

  const handleLessonClick = (lesson) => {
    setActiveLesson(lesson);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!courseInfo) {
    return <div>Không tìm thấy thông tin khóa học</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PageHeader
        className="site-page-header"
        onBack={() => window.history.back()}
        title={courseInfo.title}
        subTitle="Xem khóa học"
      />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-col md:flex-row justify-center p-5 bg-white flex-1">
          <div className="w-full md:w-2/3 p-6 mr-0 md:mr-4 mb-4 md:mb-0">
            {activeLesson ? (
              <CourseVideoPlayer lesson={activeLesson} />
            ) : (
              <div className="bg-gray-200 h-96 flex items-center justify-center text-gray-500">
                Chọn một bài học để bắt đầu
              </div>
            )}
            <h1 className="text-3xl font-bold mt-6 mb-2">{courseInfo.title}</h1>
            <p className="text-gray-600 mb-6">{courseInfo.description}</p>
            
            <h2 className="text-2xl font-bold mb-4">Nội dung khóa học</h2>
            {courseInfo && courseInfo.chapters ? (
              <>
                <p className="text-gray-600 mb-4">
                  {courseInfo.chapters.length} chương • 
                  {courseInfo.chapters.reduce((acc, chapter) => acc + (chapter.lessons ? chapter.lessons.length : 0), 0)} bài học • 
                  Thời lượng {courseInfo.duration || 'Chưa xác định'}
                </p>
                <Collapse accordion>
                  {courseInfo.chapters.map((chapter, index) => (
                    <Panel
                      header={
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{`${index + 1}. ${chapter.title}`}</span>
                          <span className="text-gray-500">{chapter.lessons ? `${chapter.lessons.length} bài học` : 'Không có bài học'}</span>
                        </div>
                      }
                      key={index}
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
        </div>
      </div>
    </div>
  );
}

export default WatchCourse;
