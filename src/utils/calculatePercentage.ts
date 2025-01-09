export const calculatePercentage = (
  prevMonth: number,
  thisMonth: number
): number => {
 
  if (prevMonth === 0) return thisMonth * 100;

  const percentage = ((prevMonth - thisMonth) / 100) * 100;

  return Number(percentage.toFixed(0));
};
