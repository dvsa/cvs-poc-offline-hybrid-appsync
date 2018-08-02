import gql from "graphql-tag";

export const createTest = gql`
  mutation createTest(
    $id: String!
    $vehicleReg: String!
    $date: String
    $isAbandoned: Boolean
    $isPassed: Boolean
    $meterReading: Int
    $testType: String
  ) {
    createTest(
      input: {
        id: $id
        vehicleReg: $vehicleReg
        date: $date
        isAbandoned: $isAbandoned
        isPassed: $isPassed
        meterReading: $meterReading
        testType: $testType
      }
    ) {
      id
      date
      isPassed
      isAbandoned
      meterReading
      testType
      vehicleReg
    }
  }
`;
