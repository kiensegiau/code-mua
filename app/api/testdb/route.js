import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log("API testdb được gọi");
    await connectToDatabase();
    console.log("Đã kết nối database");
    
    // Lấy database elearning
    const mainDb = mongoose.connection.db;
    console.log("Database chính:", mongoose.connection.name);
    
    // Thử truy cập hocmai database
    const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
    console.log("Đã kết nối đến database hocmai");
    
    // Sử dụng phương thức collections thay vì listCollections
    const hocmaiCollections = await hocmaiDb.db.collections();
    const hocmaiCollectionNames = hocmaiCollections.map(c => c.collectionName);
    console.log("Collections trong hocmai:", hocmaiCollectionNames);
    
    // Thông tin chi tiết về từng collection
    const collectionStats = {};
    
    // Thống kê số lượng documents trong mỗi collection
    for (const collName of hocmaiCollectionNames) {
      try {
        const count = await hocmaiDb.collection(collName).countDocuments();
        collectionStats[collName] = { count };
        console.log(`Collection ${collName} có ${count} documents`);
        
        // Lấy mẫu document đầu tiên
        if (count > 0) {
          const sample = await hocmaiDb.collection(collName).findOne();
          collectionStats[collName].sampleKeys = Object.keys(sample || {});
          
          // Lấy 3 document đầu tiên cho các collection chính
          if (['courses', 'courseContents', 'users'].includes(collName)) {
            const documents = await hocmaiDb.collection(collName).find().limit(3).toArray();
            
            // Format lại dữ liệu để tránh quá nhiều thông tin
            if (collName === 'courses') {
              collectionStats[collName].samples = documents.map(doc => ({
                id: doc._id.toString(),
                title: doc.title,
                description: doc.description?.substring(0, 100) + (doc.description?.length > 100 ? '...' : ''),
                price: doc.price,
                grade: doc.grade,
                subject: doc.subject,
                enrollments: doc.enrollments
              }));
            } else if (collName === 'courseContents') {
              collectionStats[collName].samples = documents.map(doc => ({
                id: doc._id.toString(),
                courseId: doc.courseId.toString(),
                chaptersCount: doc.chapters?.length || 0,
                totalLessons: doc.chapters?.reduce((sum, c) => sum + (c.lessons?.length || 0), 0) || 0
              }));
            } else if (collName === 'users') {
              collectionStats[collName].samples = documents.map(doc => ({
                id: doc._id.toString(),
                uid: doc.uid,
                name: doc.name,
                email: doc.email,
                enrolledCoursesCount: doc.enrolledCourses?.length || 0
              }));
            }
          }
        }
      } catch (error) {
        console.error(`Lỗi khi thống kê collection ${collName}:`, error);
        collectionStats[collName] = { error: error.message };
      }
    }
    
    return NextResponse.json({
      connected: true,
      mainDbName: mongoose.connection.name,
      hocmaiDbAccessible: true,
      hocmaiCollections: hocmaiCollectionNames,
      collectionStats: collectionStats
    });
  } catch (error) {
    console.error("Lỗi khi kiểm tra database:", error);
    return NextResponse.json({
      connected: false,
      error: error.message
    }, { status: 500 });
  }
} 