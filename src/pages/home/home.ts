import { CacheUtils } from "./../../utils/cacheUtils";
import { TestsPage } from "./../tests/tests";
import { NavController } from "ionic-angular";
import { JwtProvider } from "./../../providers/jwt/jwt";
import { Component } from "@angular/core";
import { config } from "../../../aws-config";
import { StoreProvider } from "../../providers/store/store";
import { AuthProvider } from "../../providers/auth/auth";
interface ITokenInfo {
  message: string;
  json: object;
}

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  token: any = { accessToken: "", idToken: "" };
  accessTokenInfo: ITokenInfo = { message: "", json: {} };
  idTokenInfo: ITokenInfo = { message: "", json: {} };

  constructor(
    public ngfCache: CacheUtils,
    public jwt: JwtProvider,
    public navCtrl: NavController,
    public store: StoreProvider,
    public auth: AuthProvider
  ) {
    this.getTokenData();
  }

  async getTokenData() {
    this.token = await this.ngfCache.getCachedData(config.cookies.auth);

    // Validate JWT tokens.
    const getAccessTokenInfoPromise = this.jwt.validateJWTToken(
      this.token.accessToken
    );
    const getIdTokenInfoPromise = this.jwt.validateJWTToken(this.token.idToken);

    try {
      const [accTokenInfo, idTokenInfo] = [
        await getAccessTokenInfoPromise,
        await getIdTokenInfoPromise
      ];

      this.accessTokenInfo = accTokenInfo;
      this.idTokenInfo = idTokenInfo;
    } catch (err) {
      console.log("validation", err);
    }
  }

  logout() {
    this.auth.logout();
  }

  viewTests() {
    this.navCtrl.push(TestsPage);
  }
}
