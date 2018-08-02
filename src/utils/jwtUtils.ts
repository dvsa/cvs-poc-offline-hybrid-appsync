import { HttpClient } from "@angular/common/http";
import { config } from "../../aws-config";
import * as jose from "node-jose";
import { Injectable } from "@angular/core";

@Injectable()
export class JwtUtils {
  constructor(public http: HttpClient) {}

  readHeader(token) {
    var sections = token.split(".");
    var header = jose.util.base64url.decode(sections[0]);
    header = JSON.parse(header);
    return header;
  }

  getAWSCognitoKeys() {
    return this.http
      .get(`https://${config.jwt.keysHost}${config.jwt.keysPath}`)
      .toPromise()
      .then(data => data);
  }

  findMatchingKey(keys, keyId) {
    var keyIndex = -1;
    for (var i = 0; i < keys.length; i++) {
      if (keyId == keys[i].kid) {
        keyIndex = i;
        break;
      }
    }

    return keyIndex;
  }
}
