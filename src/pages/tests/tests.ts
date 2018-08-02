import { setTestUpdates } from "../../utils/test-helpers";
import { Vehicle } from "./../../providers/store/graphql/types";
import { listAllVehicles } from "./../../providers/store/graphql/queries";
import { onCreateTest } from "./../../providers/store/graphql/subscriptions";
import { StoreProvider } from "./../../providers/store/store";
import { Component } from "@angular/core";
import { ModalController } from "ionic-angular";

import { SubmitTestComponent } from "../../components/submit-test/submit-test";
import { default as niceBytes } from "../../utils/byte-converter";

/**
 * Generated class for the TestsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-tests",
  templateUrl: "tests.html"
})
export class TestsPage {
  vehicles: Vehicle[]; // add a type for this
  subscription: () => void;
  storage: Object = { usage: 0, quota: 0 };
  authorised: boolean;

  constructor(public modalCtrl: ModalController, private store: StoreProvider) {
    this.getStorage();
  }

  getStorage() {
    const windowNavigator = window.navigator as any;
    if ("storage" in windowNavigator && "estimate" in windowNavigator.storage) {
      windowNavigator.storage.estimate().then(estimate => {
        this.storage = {
          usage: niceBytes(estimate.usage),
          quota: niceBytes(estimate.quota)
        };
      });
    } else if ("webkitTemporaryStorage" in windowNavigator) {
      windowNavigator.webkitTemporaryStorage.queryUsageAndQuota(
        function(used = 0, quota = 0) {
          this.storage = {
            usage: niceBytes(used),
            quota: niceBytes(quota)
          };
        }.bind(this)
      );
    }
  }

  ionViewDidLoad() {
    this.store.hc
      .then(client => {
        // create query observable
        const vehiclesQry = client.watchQuery({
          query: listAllVehicles,
          fetchPolicy: "cache-and-network"
        });

        // subscribe to query observable to write any updates
        vehiclesQry.subscribe(
          ({ data }) => {
            this.authorised = true;
            if (!data || !data.listVehicles) {
              return console.log("get vehicles: no data");
            }

            this.vehicles = data.listVehicles.vehicles;
          },
          error => {
            this.authorised = false;
          }
        );

        // connect to graphql subscription for updates made on other devices
        this.subscription = vehiclesQry.subscribeToMore({
          document: onCreateTest,
          updateQuery: (
            prev,
            {
              subscriptionData: {
                data: { onCreateTest }
              }
            }
          ) => {
            if (!onCreateTest) {
              return prev;
            }

            return {
              ...prev,
              listVehicles: {
                __typename: "vehicleConnection",
                vehicles: [
                  ...setTestUpdates(prev.listVehicles.vehicles, onCreateTest)
                ]
              }
            };
          }
        });

        return vehiclesQry;
      })
      .catch(err => {
        console.log("client err", err);
      });
  }

  showTestForm(vehicleReg: string) {
    let testFormModal = this.modalCtrl.create(SubmitTestComponent);
    testFormModal.onDidDismiss(data => {
      if (data) {
        this.store.setTest({ ...data, vehicleReg });
      }
    });
    testFormModal.present();
  }
}
