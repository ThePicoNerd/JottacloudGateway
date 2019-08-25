import Mountpoint from "../mountpoint";

export interface ObjectMeta {
  name: string;
}

export interface BucketLocation {
  mountpoint: Mountpoint;
  directory: string;
  name: string;
}