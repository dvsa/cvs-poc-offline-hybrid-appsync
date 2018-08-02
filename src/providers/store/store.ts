import { CacheUtils } from "./../../utils/cacheUtils";
import { setTestUpdates } from "../../utils/test-helpers";
import { Test } from "./graphql/types";
import { listAllVehicles } from "./graphql/queries";
import { createTest } from "./graphql/mutations";
import { Injectable } from "@angular/core";
import { default as AWSAppSyncClient } from "aws-appsync";
import { Credentials as awsCredentials } from "aws-sdk";

import { default as asConfig, config } from "../../../aws-config";

const { graphqlEndpoint: url, region, authenticationType: authType } = asConfig;

@Injectable()
export class StoreProvider {
  hc: any;

  constructor(private ngfCache: CacheUtils) {
    // create client
    this.hc = new AWSAppSyncClient({
      url,
      region,
      auth: {
        type: authType,
        credentials: async () => {
          const {
            accessKeyId,
            secretAccessKey,
            sessionToken
          }: any = await this.ngfCache.getCachedData(config.cookies.creds);

          return new awsCredentials({
            accessKeyId,
            secretAccessKey,
            sessionToken
          });
        }
      }
    }).hydrated();
  }

  setTest(testData: Test) {
    this.hc
      .then(client => {
        client.mutate({
          mutation: createTest,
          variables: testData,
          optimisticResponse: {
            __typename: "Mutation",
            createTest: {
              ...testData,
              id: Math.floor(Math.random() * 100000 + 1), // create id to be able to identify this is not from the server
              __typename: "test"
            }
          },
          update: (store, { data: { createTest } }) => {
            const query = { query: listAllVehicles };
            const vehicleQry = store.readQuery(query);

            if (typeof createTest.id === "number") {
              vehicleQry.listVehicles.vehicles = setTestUpdates(
                vehicleQry.listVehicles.vehicles,
                createTest
              );

              store.writeQuery({
                ...query,
                data: vehicleQry
              });
            }
          }
        });
      })
      .catch(err => console.log("err", err));
  }
}
