import { config } from "./../../aws-config";
import { Injectable } from "@angular/core";
import * as base64 from "base-64";

@Injectable()
export class AuthUtils {
  private secret: string;
  constructor() {
    this.secret = base64.encode(
      `${config.auth.ClientId}:${config.auth.clientSecret}`
    );
  }

  getHeaders() {
    return {
      headers: {
        Authorisation: `Basic ${this.secret}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
  }

  createPayload(code, asQryStr = false) {
    const payload = {
      grant_type: "authorization_code",
      client_id: config.auth.ClientId,
      client_secret: config.auth.clientSecret,
      redirect_uri: config.auth.redirectUri,
      code
    };

    if (!asQryStr) {
      return payload;
    }

    return Object.keys(payload)
      .map(key => key + "=" + payload[key])
      .join("&");
  }

  getAuthenticator() {
    return `cognito-idp.${config.auth.region}.amazonaws.com/${
      config.auth.UserPoolId
    }`;
  }
}
