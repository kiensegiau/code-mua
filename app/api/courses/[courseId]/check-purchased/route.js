import { NextResponse } from "next/server";
import { db } from "@/app/_utils/firebase";
import { getServerSession } from "next-auth";

export async function GET(request, { params }) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ purchased: false });
  }

  const { courseId } = params;
  const userId = session.user.id;

  const purchaseSnapshot = await db
    .collection("purchases")
    .where("userId", "==", userId)
    .where("courseId", "==", courseId)
    .limit(1)
    .get();

  const purchased = !purchaseSnapshot.empty;

  return NextResponse.json({ purchased });
}
