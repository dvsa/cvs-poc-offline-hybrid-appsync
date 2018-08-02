import gql from "graphql-tag";

export const listAllVehicles = gql`
  query {
    listVehicles {
      vehicles {
        id
        registration
        axles
        type
        make
        model
        tests {
          id
          date
          isAbandoned
          isPassed
          meterReading
          testType
          vehicleReg
        }
      }
    }
  }
`;

export const GetVehicle = gql`
  query getVehicle($id: String!) {
    getVehicle(id: $id) {
      id
      registration
      axles
      type
      make
      model
      tests {
        date
        isAbandoned
        isPassed
        meterReading
        testType
        defects {
          name
          description
          level
        }
      }
    }
  }
`;
