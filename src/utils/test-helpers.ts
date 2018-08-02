import * as update from "immutability-helper";

const updateTests = (vehicle, newTest) => {
  return update(vehicle, {
    tests: {
      $apply: tests => {
        const exists = tests.some(test => test.id === newTest.id);
        return exists ? tests : [newTest, ...tests];
      }
    }
  });
};

// function to provide an update to immutable data
export const setTestUpdates = (vehicles, newTest) => {
  return vehicles.map(vehicle => {
    if (vehicle.registration === newTest.vehicleReg) {
      return updateTests(vehicle, newTest);
    }

    return vehicle;
  });
};
