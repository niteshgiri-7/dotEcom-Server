export const calculatePercentage = (prevMonth, thisMonth) => {
    if (prevMonth === 0)
        return thisMonth * 100;
    const percentage = (thisMonth / prevMonth) * 100;
    return Number(percentage.toFixed(0));
};
