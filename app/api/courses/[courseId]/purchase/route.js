import { NextResponse } from "next/server";
import { db } from "@/app/_utils/firebase";
import { getServerSession } from "next-auth";

export async function POST(request, { params }) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = params;
  const userId = session.user.id;

  // Check if user has already purchased the course
  const purchaseSnapshot = await db
    .collection("purchases")
    .where("userId", "==", userId)
    .where("courseId", "==", courseId)
    .limit(1)
    .get();

  if (!purchaseSnapshot.empty) {
    return NextResponse.json(
      { error: "Course already purchased" },
      { status: 400 }
    );
  }

  // Get user's wallet balance
  const userSnapshot = await db.collection("users").doc(userId).get();
  const userBalance = userSnapshot.data().balance || 0;

  // Get course price
  const courseSnapshot = await db.collection("courses").doc(courseId).get();
  const coursePrice = courseSnapshot.data().price || 0;

  if (userBalance < coursePrice) {
    return NextResponse.json(
      { error: "Insufficient balance" },
      { status: 400 }
    );
  }

  // Deduct balance and update user's wallet
  await db
    .collection("users")
    .doc(userId)
    .update({
      balance: userBalance - coursePrice,
    });

  // Save purchase to database
  await db.collection("purchases").add({
    userId,
    courseId,
    amount: coursePrice,
    purchasedAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
