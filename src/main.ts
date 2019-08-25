import { ComHemCloudIssuer } from "./auth/issuer";
import Bucket from "./storage/bucket";
import Mountpoint from "./storage/mountpoint";

import dotenv from "dotenv";
import { Stream } from "stream";

dotenv.config();

let issuer: ComHemCloudIssuer = new ComHemCloudIssuer(
  process.env.COMHEM_USERNAME,
  process.env.COMHEM_PASSWORD
);
let mountpoint: Mountpoint = {
  username: process.env.JOTTA_USERNAME,
  device: "Jotta",
  mountpoint: "Archive"
};
let bucket: Bucket = new Bucket({
  mountpoint,
  directory: "buckets",
  name: "mybucket"
}, issuer);