import { NextResponse } from "next/server";
import DiaryModel from "@/models/diaryModel";
import connectDB from "@/config/database";

// そのユーザーが日記を投稿した日付を取得する
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) => {
  try {
    await connectDB();
    const { userId } = await params;
    const diaries = await DiaryModel.find({ userId });
    console.log(diaries);
    const diaryDate: { [date: string]: string[] } = {};
    diaries.forEach((diary) => {
      if (diaryDate[diary.date]) {
        diaryDate[diary.date].push(diary._id.toString());
      } else {
        diaryDate[diary.date] = [diary._id.toString()];
      }
    });
    return NextResponse.json(
      { message: "Success", diaryDate },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};
