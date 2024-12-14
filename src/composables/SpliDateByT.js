export const useSplitDateByT = (fullDate) => {
    const [date, time] = fullDate.split('T')
    return {date, time: time.split('+')[0]}
}