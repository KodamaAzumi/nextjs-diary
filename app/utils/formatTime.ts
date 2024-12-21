export const formatTime = (time: Date = new Date()) => {
  // 今日の日付を取得できるnew Dateを格納
  const today = new Date(time);

  const hours = today.getHours().toString();
  const minutes = today.getMinutes().toString();
  return `${hours}時${minutes}分`;
};
