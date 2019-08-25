import { BucketLocation, ObjectMeta } from "./types";
import request from "request-promise";
import Token from "../../auth/token";

import path from "path";

interface Options {
  location: BucketLocation;
  name: string;
  token: Token;
}

export async function getMeta(options: Options): Promise<ObjectMeta> {
  let {
    token,
    name,
    location: { mountpoint, directory }
  } = options;

  let remotePath = path.join(
    token.username,
    mountpoint.device,
    mountpoint.mountpoint,
    directory,
    name
  );

  let response = await request({
    url: `https://jfs.jottacloud.com/jfs/${remotePath}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  });

  console.log(response);

  return {
    name: "lol"
  };
}
