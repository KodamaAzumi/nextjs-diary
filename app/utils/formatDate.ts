export const formatDate = (time: Date = new Date()) => {
  // 今日の日付を取得できるnew Dateを格納
  const today = new Date(time);

  // 年・月・日を取得
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
};
