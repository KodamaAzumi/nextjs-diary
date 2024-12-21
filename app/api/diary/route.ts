import { NextResponse } from "next/server";
import DiaryModel from "@/models/diaryModel";
import connectDB from "@/config/database";

export const POST = async (req: Request) => {
  try {
    await connectDB();
    const { userId, title, content, img, date } = await req.json();
    const newDiary = new DiaryModel({ userId, title, content, img, date });
    const savedDiary = await newDiary.save();
    return NextResponse.json(
      { message: "Success", savedDiary },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};
