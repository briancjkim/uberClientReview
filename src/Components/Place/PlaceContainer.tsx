import React from "react";
import { EDIT_PLACE } from "./PlaceQueries";
import { Mutation } from "react-apollo";
import { editPlace, editPlaceVariables } from "../../types/api";
import { GET_PLACES } from "../../sharedQueriesLocal";
import PlacePresenter from "./PlacePresenter";

interface IProps {
  name: string;
  address: string;
  id: number;
  fav: boolean;
}
class FavMutation extends Mutation<editPlace, editPlaceVariables> {}
class PlaceContainer extends React.Component<IProps> {
  public render() {
    const { id, fav, name, address } = this.props;
    return (
      <FavMutation
        mutation={EDIT_PLACE}
        variables={{
          placeId: id,
          isFav: !fav
        }}
        refetchQueries={[{ query: GET_PLACES }]}
      >
        {editPlaceFn => (
          <PlacePresenter
            onStartPress={editPlaceFn}
            fav={fav}
            name={name}
            address={address}
          />
        )}
      </FavMutation>
    );
  }
}
export default PlaceContainer;
