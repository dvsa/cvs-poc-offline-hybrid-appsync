import { HomePage } from "./../home/home";
import { AuthProvider } from "./../../providers/auth/auth";
import { Component } from "@angular/core";

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: "page-main",
  templateUrl: "main.html"
})
export class MainPage {
  code: any;
  tokens: any;
  constructor(public auth: AuthProvider) {
    // check for code param in url
    const code = location.search.split("code=")[1];
    // pass to auth.requestAccessToken if present
    if (code) this.checkCode(code);
  }

  async checkCode(code) {
    await this.auth.requestAccessToken(code, HomePage);
  }

  async login() {
    try {
      await this.auth.redirect(HomePage);
    } catch (error) {
      console.log("error getting code");
    }
  }
}
