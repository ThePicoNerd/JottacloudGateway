export interface ObjectMeta {
  name: string;
}

export interface BucketLocation {
  mountpoint: Mountpoint;
  directory: string;
  name: string;
}

export interface Mountpoint {
  device: string;
  mountpoint: string;
}