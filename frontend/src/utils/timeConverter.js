export default function timeConverter(time) {
    const timeSeries = [[60, "seconds"], [60, "minutes"], [60, "hours"], [24, "days"], [365, "years"]];
    let i = 0;
    for (; time > timeSeries[i][0]; time = Math.floor(time / timeSeries[i][0]), i++);
    return `${Math.floor(time)} ${timeSeries[i][1]}`
}