export default class Token {
  value: string;
  issuedAt: Date;

  constructor(value: string) {
    this.value = value;
    this.issuedAt = new Date();
  }
}