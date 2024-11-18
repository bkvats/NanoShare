self.onmessage = (event) => {
    const { file, dataChunk } = event.data;
    // if (file.startTime == null) file.startTime = Date.now();
    file.chunks.push(dataChunk);
    // file.receivedSize += dataChunk.byteLength;
    // file.elapsedTime = Math.floor((Date.now() - file.startTime) / 1000);
    // const speed = Math.floor(file.receivedSize / file.elapsedTime);
    // const receivedPercentage = (file.receivedSize * 100 / file.filesize).toFixed(2);
    // const timeLeft = (file.filesize - file.receivedSize) / speed;
    self.postMessage({file});
}