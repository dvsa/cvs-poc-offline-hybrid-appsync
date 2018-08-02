import { AuthUtils } from "./../utils/authUtils";
import { TestsPage } from "./../pages/tests/tests";
import { BrowserModule } from "@angular/platform-browser";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { NgForageModule } from "@ngforage/ngforage-ng4";

import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";

import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { MainPage } from "./../pages/main/main";
import { StoreProvider } from "../providers/store/store";
import { SubmitTestComponent } from "./../components/submit-test/submit-test";
import { AuthProvider } from "../providers/auth/auth";
import { JwtProvider } from "../providers/jwt/jwt";
import { JwtUtils } from "../utils/jwtUtils";
import { CacheUtils } from "../utils/cacheUtils";

@NgModule({
  declarations: [MyApp, HomePage, MainPage, TestsPage, SubmitTestComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    NgForageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage, MainPage, TestsPage, SubmitTestComponent],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    StoreProvider,
    AuthProvider,
    JwtProvider,
    JwtUtils,
    CacheUtils,
    AuthUtils,
    InAppBrowser
  ]
})
export class AppModule {}
