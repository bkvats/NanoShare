export default function sizeConverter(size) {
    const sizeMap = new Map([
        [0, "B"],
        [1, "KB"],
        [2, "MB"],
        [3, "GB"],
        [4, "TB"],
        [5, "PB"],
        [6, "EB"]
    ]);
    let count = 0;
    for (; size >= 1024; count++, size /= 1024);
    return `${size.toFixed(2)} ${sizeMap.get(count)}`;
}