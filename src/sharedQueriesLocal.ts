import { gql } from "apollo-boost";

export const USER_PROFILE = gql`
  query userProfile {
    GetMyProfile {
      ok
      error
      user {
        id
        firstName
        lastName
        email
        fullName
        isDriving
        profilePhoto
      }
    }
  }
`;

export const GET_PLACES = gql`
  query getPlaces {
    GetMyPlaces {
      ok
      error
      places {
        isFav
        address
        name
        id
      }
    }
  }
`;
