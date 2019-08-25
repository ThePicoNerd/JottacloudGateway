import request from "request-promise";
import $ from "cheerio";

import jwt from "jsonwebtoken";

import Token from "./token";

export abstract class Issuer {
  public margin: number = 600; // Seconds before expiration date that token should be renewed.

  abstract async getToken(): Promise<Token>;
}

export class SimpleIssuer extends Issuer {
  private token: string;

  constructor(token: string) {
    super();
    this.token = token;
  }

  async getToken() {
    return new Token(this.token);
  }
}

export class ComHemCloudIssuer extends Issuer {
  public username: string;
  private password: string;

  private token: Token = null;

  constructor(username: string, password: string) {
    super();
    this.username = username;
    this.password = password;
  }

  /**
   * Get an auth token with the help of magic.
   *
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Token>} Auth token
   */
  async getToken() {
    if (this.token) {
      let data: any = jwt.decode(this.token.value);

      if (Date.now() < (data.exp - this.margin) * 1000) {
        return this.token;
      }
    }

    console.log("Generating new token ...");

    this.token = await this.authenticate();
    return this.token;
  }

  private async authenticate(): Promise<Token> {
      let jar = request.jar();
    
      await request({
        url: "https://cloud.comhem.se/login",
        method: "GET",
        qs: {
          bC: "COMHEM",
          destination: "%2Fweb%2Farchive%2Flist%2Fname"
        },
        jar
      });
    
      let superSecretHtml = await request({
        url: "https://login.comhem.se/authn/authenticate/ComHemkonto",
        method: "POST",
        form: {
          userName: this.username,
          password: this.password
        },
        jar
      });
    
      let evenMoreSecretHtml = await request({
        url: "https://login.comhem.se/oauth/v2/authorization",
        method: "POST",
        qs: {
          client_id: "jotta",
          forceAuthN: "true"
        },
        form: {
          token: $(`input[name="token"]`, superSecretHtml).attr("value"),
          state: $(`input[name="state"]`, superSecretHtml).attr("value")
        },
        jar,
        followAllRedirects: true
      });
    
      let token = evenMoreSecretHtml.match(/var\s+authToken\s+=\s+'[A-Za-z0-9\.\-\_]+'/g)[0];
      token = token.substring(token.indexOf("'"));
      token = token.replace(/'/g, "");
    
      return new Token(token);
    }
}