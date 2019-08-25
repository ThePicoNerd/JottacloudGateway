import jwt from "jsonwebtoken";

export default class Token {
  value: string;
  issuedAt: Date;

  get username(): string {
    let data: any = jwt.decode(this.value);

    return data.username;
  }

  constructor(value: string) {
    this.value = value;
    this.issuedAt = new Date();
  }
}