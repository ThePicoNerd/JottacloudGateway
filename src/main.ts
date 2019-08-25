import { ComHemCloudIssuer } from "./auth/issuer";
import Bucket from "./storage/bucket";

import dotenv from "dotenv";
dotenv.config();

import Koa from "koa";
import Router from "koa-router";

let server = new Koa();
let router = new Router();
let port = process.env.PORT || 8080;

let issuer: ComHemCloudIssuer = new ComHemCloudIssuer(
  process.env.COMHEM_USERNAME,
  process.env.COMHEM_PASSWORD
);
let mountpoint = {
  device: "Jotta",
  mountpoint: "Archive"
};
let bucket: Bucket = new Bucket(
  {
    mountpoint,
    directory: "buckets",
    name: "minecraft"
  },
  issuer
);

router.get("/:objectName*", async ctx => {
  let name = ctx.params.objectName;

  try {
    let meta = await bucket.get(name);

    return ctx.send(meta);
  } catch (error) {
    if (error.statusCode == 404) {
      return ctx.throw(404);
    } else {
      throw error;
    }
  }
});

server.use(router.routes());
server.use(router.allowedMethods());

server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
