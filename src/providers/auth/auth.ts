import { CacheUtils } from "./../../utils/cacheUtils";
import { AuthUtils } from "./../../utils/authUtils";
import { config } from "./../../../aws-config";
import { HttpClient } from "@angular/common/http";

import { App, NavController } from "ionic-angular";
import { Injectable } from "@angular/core";
// import { HomePage } from "./../../pages/home/home";
import { MainPage } from "./../../pages/main/main";
import {
  config as awsConfig,
  CognitoIdentityCredentials,
  Credentials as awsCredentials
} from "aws-sdk";
import "rxjs/add/operator/toPromise";
import { Platform } from "ionic-angular";
import { InAppBrowser } from "@ionic-native/in-app-browser";

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  code: any;
  private navCtrl: NavController;
  constructor(
    public http: HttpClient,
    private ngfCache: CacheUtils,
    private authUtils: AuthUtils,
    private platform: Platform,
    private inAppBrowser: InAppBrowser,
    private app: App
  ) {
    this.navCtrl = this.app.getActiveNav();
  }

  /**
   * generate login url and redirect to
   * next: next page to redirect to
   */
  async redirect(next) {
    var url =
      config.auth.cognitoUrl +
      "/oauth2/authorize?identity_provider=" +
      config.auth.identityProvider +
      "&redirect_uri=" +
      encodeURIComponent(config.auth.redirectUri) +
      "&response_type=" +
      config.auth.responseType +
      "&client_id=" +
      config.auth.ClientId +
      "&client_secret=" +
      config.auth.clientSecret +
      "&scope=" +
      config.auth.scope;

    if (this.platform.is("cordova")) {
      const browser = this.inAppBrowser.create(url, "_blank", {
        location: "no",
        clearcache: "yes",
        clearsessioncache: "yes"
      });

      return await browser.on("loadstop").subscribe(
        async event => {
          await this.requestAccessToken(event.url.split("code=")[1], next);
          browser.close();
        },
        err => console.log(err),
        () => {}
      );
    } else {
      window.open(url, "_self");
      await this.requestAccessToken(location.search.split("code=")[1], next);
    }
  }

  /**
   * retrieve temp credentials from congnito using token id
   * @param tokenId STRING
   */
  async retrieveCredentials(tokenId) {
    const authenticator = this.authUtils.getAuthenticator();

    awsConfig.update({ region: config.auth.region });

    awsConfig.credentials = new CognitoIdentityCredentials({
      IdentityPoolId: config.auth.identityPoolId,
      Logins: {
        [authenticator]: tokenId
      }
    });

    await (awsConfig.credentials as awsCredentials).getPromise();
  }

  /**
   * request access token using code returned fomr azure AD
   * @param code  STRING
   * @param nextPage Page to redirect to on success
   */
  async requestAccessToken(code, nextPage) {
    const defaults = await this.authUtils.getHeaders();
    const qryString = await this.authUtils.createPayload(code, true);

    // convert result to observable
    return new Promise((resolve, reject) => {
      this.http
        .post(
          `${config.auth.cognitoUrl}${config.auth.oAuthEndpoint}`,
          qryString,
          defaults
        )
        .toPromise()
        .then(async (data: any) => {
          await this.ngfCache.setCache(
            config.cookies.auth,
            {
              accessToken: data.access_token,
              idToken: data.id_token
            },
            data.expires_in * 1000
          );

          await this.ngfCache.setCache(
            config.cookies.refresh,
            { refreshToken: data.refresh_token },
            2592000000
          );

          try {
            await this.retrieveCredentials(data.id_token);
            const {
              accessKeyId,
              secretAccessKey,
              sessionToken
            }: any = awsConfig.credentials;
            await this.ngfCache.setCache(
              config.cookies.creds,
              {
                accessKeyId,
                secretAccessKey,
                sessionToken
              },
              data.expires_in * 1000
            );

            this.navCtrl.setRoot(nextPage);
            this.navCtrl.popToRoot();
          } catch (error) {
            console.log("error trying to get credentials");
            reject(error);
          }

          resolve(data);
        })
        .catch(err => console.log("access token error", err));
    });
  }

  logout() {
    this.removeCookies();

    const logoutUrl = `${config.auth.cognitoUrl}/logout?client_id=${
      config.auth.ClientId
    }&logout_uri=${encodeURIComponent(config.auth.logoutUri)}`;

    if (this.platform.is("cordova")) {
      const browser = this.inAppBrowser.create(logoutUrl, "_blank", {
        hidden: "yes",
        location: "no",
        clearcache: "yes",
        clearsessioncache: "yes"
      });

      return browser.on("loadstop").subscribe(
        event => {
          browser.close();
          this.navCtrl.setRoot(MainPage);
          this.navCtrl.popToRoot();
        },
        err => console.log(err),
        () => {}
      );
      //return this.loginHandler(browser);
    } else {
      window.localStorage.clear();
      window.open(logoutUrl, "_self");
      this.navCtrl.setRoot(MainPage);
      this.navCtrl.popToRoot();
    }
  }

  async removeCookies() {
    await this.ngfCache.deleteCache(config.cookies.auth);
    await this.ngfCache.deleteCache(config.cookies.refresh);
    await this.ngfCache.deleteCache(config.cookies.creds);
  }
}
