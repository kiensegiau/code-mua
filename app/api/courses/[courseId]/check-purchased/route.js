import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/app/_utils/mongodb";
import Purchase from "@/app/_utils/models/Purchase";

export async function GET(request, { params }) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ purchased: false });
  }

  const { courseId } = params;
  const userId = session.user.id;

  try {
    await connectToDatabase();
    
    const purchase = await Purchase.findOne({
      userId: userId,
      courseId: courseId
    });

    const purchased = !!purchase;

    return NextResponse.json({ purchased });
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái mua khóa học:", error);
    return NextResponse.json({ purchased: false, error: "Lỗi máy chủ" }, { status: 500 });
  }
}
