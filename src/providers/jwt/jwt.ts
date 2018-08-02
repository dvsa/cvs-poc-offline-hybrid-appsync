import { JwtUtils } from "./../../utils/jwtUtils";
import { Injectable } from "@angular/core";

import * as jose from "node-jose";
import { default as jsonPretty } from "json-pretty-html";
import { config } from "../../../aws-config";

/*
  Generated class for the JwtProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class JwtProvider {
  constructor(private jwt: JwtUtils) {}

  async validateJWTToken(token) {
    const header = this.jwt.readHeader(token);

    try {
      const data: any = await this.jwt.getAWSCognitoKeys();
      const keyIndex = this.jwt.findMatchingKey(data.keys, header.kid);

      if (keyIndex == -1) {
        return "Public key not found in jwks.json";
      } else {
        const publicKey = await jose.JWK.asKey(data.keys[keyIndex]);
        const validToken = await jose.JWS.createVerify(publicKey).verify(token);
        const newDate: any = new Date();

        // Token is valid - now validate the claims
        let validity = { message: "", isValid: false, json: "" };
        const claims = JSON.parse(validToken.payload);
        const current_ts = Math.floor(newDate / 1000);

        if (current_ts > claims.exp) {
          // Validate expiry
          validity.message = "Token has expired";
          validity.isValid = false;
        } else if (claims.aud && claims.aud != config.auth.ClientId) {
          // Validate audience
          validity.message = "Token not issued for this audience";
          validity.isValid = false;
        } else {
          // Is valid
          validity.message = "Token is valid";
          validity.json = jsonPretty(JSON.parse(validToken.payload));
          validity.isValid = true;
        }
        return validity;
      }
    } catch (error) {
      return error;
    }
  }
}
