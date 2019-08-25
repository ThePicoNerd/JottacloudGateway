import { Issuer } from "../auth/issuer";
import { Stream } from "stream";
import * as path from "path";
import Mountpoint from "./mountpoint";
import { upload } from "./api/upload";
import { getStreamInfo } from "../hash/stream";
import { BucketLocation } from "./api/types";

export default class Bucket {
  public issuer: Issuer;
  public location: BucketLocation;

  get name() {
    return this.location.name;
  }

  set name(value) {
    this.location.name = value;
  }

  get path() {
    return path.join(this.location.directory, this.name);
  }

  constructor(location: BucketLocation, issuer: Issuer) {
    this.location = location;
    this.issuer = issuer;
  }

  async uploadObject(
    objectName: string,
    stream: Stream
  ): Promise<void> {
    let token = await this.issuer.getToken();
    let info = await getStreamInfo(stream);

    upload({
      size: info.size,
      md5: info.md5,
      token: token,
      stream: stream,
      location: this.location,
      name: this.encode(objectName),
    });

    console.log(info);
  }

  private encode(plain: string): string {
    if (plain[plain.length - 1] == "/") {
      throw new Error("File names cannot end with a slash!");
    }

    return Buffer.from(plain).toString("hex");
  }

  private decode(encoded: string): string {
    return Buffer.from(encoded, "hex").toString();
  }
}
