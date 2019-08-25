import { Stream } from "stream";
import crypto from "crypto";

interface StreamInfo {
  md5: string;
  size: number;
}

export const getStreamInfo = (stream: Stream): Promise<StreamInfo> => new Promise((resolve, reject) => {
  let size = 0;
  let hash = crypto.createHash("md5");

  stream.on("error", reject);

  stream.on("data", chunk => {
    size += chunk.byteLength;
    hash.update(chunk);
  });

  stream.on("end", () => {
    return resolve({
      md5: hash.digest("hex"),
      size
    })
  });
});