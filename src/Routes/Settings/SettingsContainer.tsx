import React from "react";
import SettingsPresenter from "./SettingsPresenter";
import { LOG_USER_OUT } from "../../sharedQueries";
import { USER_PROFILE, GET_PLACES } from "../../sharedQueriesLocal";
import { Mutation, Query } from "react-apollo";
import { userProfile, getPlaces } from "../../types/api";

class PlacesQuery extends Query<getPlaces> {}
class MiniProfileQuery extends Query<userProfile> {}
class SettingsContainer extends React.Component {
  public render() {
    return (
      <Mutation mutation={LOG_USER_OUT}>
        {logUserOut => (
          <MiniProfileQuery query={USER_PROFILE}>
            {({ data, loading: userDataLoading }) => (
              <PlacesQuery query={GET_PLACES}>
                {({ data: placesData, loading: placesLoading }) => (
                  <SettingsPresenter
                    userDataLoading={userDataLoading}
                    userData={data}
                    placesData={placesData}
                    placesDataLoading={placesLoading}
                    logUserOut={logUserOut}
                  />
                )}
              </PlacesQuery>
            )}
          </MiniProfileQuery>
        )}
      </Mutation>
    );
  }
}
export default SettingsContainer;
