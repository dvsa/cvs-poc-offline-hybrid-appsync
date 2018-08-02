export type Test = {
  id: string;
  vehicleReg: string;
  date: string;
  isAbandoned: boolean;
  isPassed: boolean;
  meterReading: number;
  testType: string;
};

export type Vehicle = {
  id: string;
  registration: string;
  axles: number;
  type: string;
  make: string;
  model: string;
  tests: [Test];
};
