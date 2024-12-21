export const formatDateStr = (dateString: string) => {
  // 入力された日付を分割
  const [year, month, day] = dateString.split("-");

  // 年、月、日を結合してフォーマット
  return `${year}年${parseInt(month, 10)}月${parseInt(day, 10)}日`;
};
