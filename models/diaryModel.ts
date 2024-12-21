import { Schema, model, models, Document } from "mongoose";

interface Diary extends Document {
  date: string;
  title: string;
  content: string;
  img: string;
}

const DiarySchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      max: 10,
    },
    content: {
      type: String,
      required: true,
      max: 200,
    },
    img: {
      type: String,
    },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

// 既存のモデルがある場合は再利用、なければ新しいモデルを作る
const DiaryModel = models.Diary || model<Diary>("Diary", DiarySchema);

export default DiaryModel;
