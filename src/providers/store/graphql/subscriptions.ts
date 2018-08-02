import gql from "graphql-tag";

export const onCreateTest = gql`
  subscription onCreateTest {
    onCreateTest {
      id
      vehicleReg
      isAbandoned
      isPassed
      meterReading
      testType
    }
  }
`;
