"use client";
import React from "react";
import WelcomeBanner from "./_components/WelcomeBanner";
import CourseList from "./_components/CourseList";

function Courses() {
  return (
    <>
      {/* Banner */}
      <WelcomeBanner />

      {/* Course List */}
      <div className="mt-6">
        <CourseList className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" />
      </div>
    </>
  );
}

export default Courses;
