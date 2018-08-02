import { CacheUtils } from "./../utils/cacheUtils";
import { Component, ViewChild } from "@angular/core";
import { Platform, NavController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { config } from "./../../aws-config";
import { MainPage } from "../pages/main/main";
import { HomePage } from "./../pages/home/home";
@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild("rootNav") nav: NavController;
  rootPage: any = MainPage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private cacheUtils: CacheUtils
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is("cordova")) {
        statusBar.styleDefault();
        splashScreen.hide();
      }
    });
  }
  async ngOnInit() {
    const authCookie = await this.cacheUtils.hasBeenCached(config.cookies.auth);

    if (authCookie) {
      this.rootPage = HomePage;
    }
  }
}
