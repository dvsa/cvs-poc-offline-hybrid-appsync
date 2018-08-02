import { Test } from "./../../providers/store/graphql/types";
import { Component } from "@angular/core";
import { ViewController } from "ionic-angular";
import { UUID } from "angular2-uuid";

/**
 * Generated class for the SubmitTestComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "submit-test",
  templateUrl: "submit-test.html"
})
export class SubmitTestComponent {
  test: Test = {
    id: "",
    vehicleReg: "",
    isAbandoned: false,
    isPassed: false,
    meterReading: 0,
    testType: "",
    date: new Date().toISOString().slice(0, 10)
  };
  // modal to add some test details and submit to appSync
  constructor(private viewCtrl: ViewController) {}

  submitTest() {
    const id = UUID.UUID();
    this.viewCtrl.dismiss({ ...this.test, id });
  }
}
