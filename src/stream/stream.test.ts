import { getStreamInfo } from "./stream";
import { Readable } from "stream";

test("md5 works", () => {
  const stream = new Readable();
  stream._read = () => {}; // redundant? see update below
  stream.push("please work");
  stream.push(null);

  getStreamInfo(stream).then(info => {
    expect(info.md5).toBe("d01b66be8df7243a64abe30a002df939");
    expect(info.size).toBe(11);
  });
});
