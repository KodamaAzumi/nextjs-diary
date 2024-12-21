import { NextResponse } from "next/server";
import DiaryModel from "@/models/diaryModel";
import connectDB from "@/config/database";

// 日記の削除
export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ diaryId: string }> }
) => {
  try {
    await connectDB();
    const { diaryId } = await params;
    const diary = await DiaryModel.findById(diaryId);
    const deletedDiary = await diary.deleteOne();
    return NextResponse.json(
      { message: "Success", deletedDiary },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};

// 特定の日記を取得する
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ diaryId: string }> }
) => {
  try {
    await connectDB();
    const { diaryId } = await params;
    const diary = await DiaryModel.findById(diaryId);
    return NextResponse.json({ message: "Success", diary }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ diaryId: string }> }
) => {
  try {
    await connectDB();
    const { diaryId } = await params;
    const { title, content } = await req.json();

    const diary = await DiaryModel.findById(diaryId);
    const updatedDiary = await diary.updateOne({
      $set: {
        title,
        content,
      },
    });
    return NextResponse.json(
      { message: "Success", updatedDiary },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};
