"use client";
import { useEffect, useState } from "react";
import { Collapse, Button, List } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
// Đảm bảo rằng bạn đã cấu hình Tailwind CSS

const { Panel } = Collapse;

function WatchCourse({ params }) {
  const [courseInfo, setCourseInfo] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    // Sử dụng dữ liệu giả
    setCourseInfo(fakeCourseData);
  }, []);

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

  if (!courseInfo) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="flex flex-col items-center p-5 bg-white">
      <div className="w-full max-w-4xl bg-white p-3 rounded-lg shadow">
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold">{courseInfo.title}</h1>
          <p className="text-gray-600">{courseInfo.description}</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Nội dung khóa học</h2>
          <p className="text-gray-600 mb-4">
            {courseInfo.chapters.length} chương •{" "}
            {courseInfo.chapters.reduce(
              (acc, chapter) => acc + chapter.lessons.length,
              0
            )}{" "}
            bài học • Thời lượng 10 giờ 29 phút
          </p>
          <Collapse accordion>
            {courseInfo.chapters.map((chapter, index) => (
              <Panel
                header={
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{`${index + 1}. ${
                      chapter.title
                    }`}</span>
                    <span className="text-gray-500">
                      {chapter.lessons.length} bài học
                    </span>
                  </div>
                }
                key={chapter.id}
                className="custom-panel-header"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={chapter.lessons}
                  renderItem={(lesson) => (
                    <List.Item
                      onClick={() => setActiveLesson(lesson)}
                      className="cursor-pointer flex justify-between items-center"
                    >
                      <List.Item.Meta
                        avatar={<PlayCircleOutlined />}
                        title={
                          <div className="flex justify-between w-full p-0">
                            <span className="text-gray-500 p-0">
                              {lesson.title}
                            </span>
                            <span className="text-gray-400 p-0">
                              {lesson.duration}
                            </span>
                          </div>
                        }
                        
                      />
                    </List.Item>
                  )}
                />
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>
      <div className="w-full max-w-xs mt-5 bg-white p-3 rounded-lg shadow">
        <div className="flex flex-col items-center">
          <div className="mb-5">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Course Video"
              className="rounded-lg"
            />
            <Button type="primary" className="mt-3">
              Xem giới thiệu khóa học
            </Button>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-500">Miễn phí</h3>
            <Button type="primary" className="mt-3">
              Đăng ký học
            </Button>
            <ul className="list-none p-0 mt-5 text-gray-600">
              <li>Trình độ cơ bản</li>
              <li>Tổng số 138 bài học</li>
              <li>Thời lượng 10 giờ 29 phút</li>
              <li>Học mọi lúc, mọi nơi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchCourse;
