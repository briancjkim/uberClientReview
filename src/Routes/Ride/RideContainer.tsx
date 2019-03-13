import React from "react";
import RidePresenter from "./RidePresenter";
import { RouteComponentProps } from "react-router";
import { Query, Mutation } from "react-apollo";
import {
  getRide,
  getRideVariables,
  userProfile,
  updateRide,
  updateRideVariables
} from "../../types/api";
import { GET_RIDE, RIDE_SUBSCRIPTION, UPDATE_RIDE_STATUS } from "./RideQueries";
import { USER_PROFILE } from "../../sharedQueriesLocal";
import { toast } from "react-toastify";

interface IProps extends RouteComponentProps<any> {}

class RideQuery extends Query<getRide, getRideVariables> {}
class ProfileQuery extends Query<userProfile> {}
class RideUpdateMutation extends Mutation<updateRide, updateRideVariables> {}

class RideContainer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    if (!props.match.params.rideId) {
      props.history.push("/");
    }
  }
  public render() {
    const {
      match: {
        params: { rideId }
      }
    } = this.props;
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => (
          <RideQuery
            query={GET_RIDE}
            variables={{ rideId: parseInt(rideId, 10) }}
          >
            {({ data, loading, subscribeToMore }) => {
              const { history } = this.props;
              const subscribeOptions = {
                document: RIDE_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) {
                    return prev;
                  }
                  const {
                    data: {
                      RideStatusSubscription: { status }
                    }
                  } = subscriptionData;

                  if (status === "FINISHED") {
                    history.push("/");
                  }
                }
              };
              subscribeToMore(subscribeOptions);
              return (
                <RideUpdateMutation
                  mutation={UPDATE_RIDE_STATUS}
                  refetchQueries={[
                    {
                      query: GET_RIDE,
                      variables: { rideId: parseInt(rideId, 10) }
                    }
                  ]}
                >
                  {updateRideFn => (
                    <RidePresenter
                      userData={userData}
                      loading={loading}
                      data={data}
                      updateRideFn={updateRideFn}
                    />
                  )}
                </RideUpdateMutation>
              );
            }}
          </RideQuery>
        )}
      </ProfileQuery>
    );
  }
}
export default RideContainer;
