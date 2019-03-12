import React from "react";
import { Query } from "react-apollo";
import { getPlaces } from "../../types/api";
import { GET_PLACES } from "../../sharedQueriesLocal";
import PlacesPresenter from "./PlacesPresenter";

class PlacesQuery extends Query<getPlaces> {}
class PlacesContainer extends React.Component {
  public render() {
    return (
      <PlacesQuery query={GET_PLACES}>
        {({ data, loading }) => (
          <PlacesPresenter data={data} loading={loading} />
        )}
      </PlacesQuery>
    );
  }
}
export default PlacesContainer;
