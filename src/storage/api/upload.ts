import Token from "../../auth/token";
import request from "request-promise";
import { Stream } from "stream";
import Mountpoint from "../mountpoint";
import path from "path";
import { ObjectMeta, BucketLocation } from "./types";

interface UploadOptions {
  token: Token;
  name: string;
  size: number;
  md5: string;
  stream: Stream;
  location: BucketLocation;
  created?: Date;
}

export async function upload(options: UploadOptions): Promise<ObjectMeta> {
  let { token, name, size, md5, location, created = new Date(), stream } = options;

  let remotePath = path.join(
    "/jfs",
    location.mountpoint.device,
    location.mountpoint.mountpoint,
    location.directory,
    location.name,
    name
  );

  let allocationInfo = await allocate({
    token: token,
    path: remotePath,
    size: size,
    md5: md5,
    created: created
  });

  console.log(allocationInfo);

  let response = await request({
    url: allocationInfo.uploadUrl,
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.token.value}`
    },
    formData: {
      file: stream
    }
  });

  console.log(response);

  return {
    name: ""
  };
}

enum UploadState {
  incomplete = "INCOMPLETE",
  completed = "COMPLETED"
}

interface AllocationOptions {
  token: Token;
  path: string;
  size: number;
  md5: string;
  created: Date;
}

interface AllocationResponse {
  uploadUrl: string;
  uploadId: string;
  state: UploadState;
  name: string;
  path: string;
}

/**
 * @returns {Promise<AllocationResponse>}
 */
async function allocate(
  options: AllocationOptions
): Promise<AllocationResponse> {
  console.log("Allocating ...");

  let response = await request({
    url: "https://api.jottacloud.com/files/v1/allocate",
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.token.value}`
    },
    json: {
      path: options.path,
      bytes: options.size,
      md5: options.md5,
      created: options.created,
      modified: options.created
    }
  });

  return {
    state: response.state,
    uploadUrl: response.upload_url,
    uploadId: response.upload_id,
    name: response.name,
    path: response.path
  };
}
