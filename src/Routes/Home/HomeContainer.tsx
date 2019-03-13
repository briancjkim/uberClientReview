import React from "react";
import { RouteComponentProps } from "react-router";
import HomePresenter from "./HomePresenter";
import ReactDOM from "react-dom";
import { Query, graphql, MutationFn, Mutation } from "react-apollo";
import {
  userProfile,
  reportMovement,
  reportMovementVariables,
  getDrivers,
  requestRide,
  requestRideVariables,
  getRides,
  acceptRide,
  acceptRideVariables
} from "../../types/api";
import { USER_PROFILE } from "../../sharedQueriesLocal";
import { geoCode, reverseGeoCode } from "../../mapHelpers";
import { toast } from "react-toastify";
import {
  REPORT_LOCATION,
  GET_NEARBY_DRIVERS,
  REQUEST_RIDE,
  GET_NEARBY_RIDE,
  ACCEPT_RIDE,
  SUBSCRIBE_NEARBY_RIDES
} from "./HomeQueries";
import { SubscribeToMoreOptions } from "apollo-client";

interface IState {
  isMenuOpen: boolean;
  lat: number;
  lng: number;
  toAddress: string;
  toLat: number;
  toLng: number;
  distance?: string;
  duration?: string;
  price?: string;
  fromAddress: string;
  isDriving?: boolean;
}
interface IProps extends RouteComponentProps<any> {
  reportLocation: MutationFn;
  google: any;
}

class RequestRideMutation extends Mutation<requestRide, requestRideVariables> {}
class NearbyQuery extends Query<getDrivers> {}
class ProfileQuery extends Query<userProfile> {}
class GetNearbyRides extends Query<getRides> {}
class AcceptRide extends Mutation<acceptRide, acceptRideVariables> {}

class HomeContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public drivers: google.maps.Marker[];
  public map: google.maps.Map;
  public userMarker: google.maps.Marker;
  public toMarker: google.maps.Marker;
  public directions: google.maps.DirectionsRenderer;
  public state = {
    isMenuOpen: false,
    lat: 0,
    lng: 0,
    toAddress: "Brisbane",
    toLat: 0,
    toLng: 0,
    distance: "",
    duration: undefined,
    price: undefined,
    fromAddress: "",
    isDriving: undefined
  };
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.drivers = [];
  }
  public componentDidMount() {
    console.log("ComponentMounted!");
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSucces,
      this.handleGeoError,
      { maximumAge: Infinity, timeout: 5000, enableHighAccuracy: true }
    );
  }

  public render() {
    const {
      isMenuOpen,
      toAddress,
      price,
      distance,
      duration,
      toLat,
      toLng,
      lat,
      lng,
      fromAddress,
      isDriving
    } = this.state;
    return (
      <ProfileQuery query={USER_PROFILE} onCompleted={this.handleProfileQuery}>
        {({ data, loading }) => (
          <NearbyQuery
            query={GET_NEARBY_DRIVERS}
            pollInterval={5000}
            skip={isDriving}
            onCompleted={this.handleNearbyDrivers}
          >
            {() => (
              <RequestRideMutation
                mutation={REQUEST_RIDE}
                variables={{
                  distance,
                  dropOffAddress: toAddress,
                  dropOffLat: toLat,
                  dropOffLng: toLng,
                  duration: duration || "",
                  pickUpAddress: fromAddress,
                  pickUpLat: lat,
                  pickUpLng: lng,
                  price: Number(price) || 0
                }}
                onCompleted={this.handleRideRequest}
              >
                {requestRideFn => (
                  <GetNearbyRides query={GET_NEARBY_RIDE} skip={!isDriving}>
                    {({ subscribeToMore, data: nearbyRide }) => {
                      const rideSubscriptionOptions: SubscribeToMoreOptions = {
                        document: SUBSCRIBE_NEARBY_RIDES,
                        updateQuery: (prev, { subscriptionData }) => {
                          if (!subscriptionData) {
                            return;
                          }
                          const newObject = Object.assign({}, prev, {
                            GetNearbyRide: {
                              ...prev.GetNearbyRide,
                              ride: subscriptionData.data.NearbyRideSubscription
                            }
                          });
                          return newObject;
                        }
                      };
                      if (isDriving) {
                        subscribeToMore(rideSubscriptionOptions);
                      }
                      return (
                        <AcceptRide
                          mutation={ACCEPT_RIDE}
                          onCompleted={this.handleRideAcceptance}
                        >
                          {acceptRideFn => (
                            <HomePresenter
                              loading={loading}
                              isMenuOpen={isMenuOpen}
                              toggleMenu={this.toggleMenu}
                              mapRef={this.mapRef}
                              toAddress={toAddress}
                              onInputChange={this.onInputChange}
                              onAddressSubmit={this.onAddressSubmit}
                              price={price}
                              data={data}
                              requestRideFn={requestRideFn}
                              nearbyRide={nearbyRide}
                              acceptRideFn={acceptRideFn}
                            />
                          )}
                        </AcceptRide>
                      );
                    }}
                  </GetNearbyRides>
                )}
              </RequestRideMutation>
            )}
          </NearbyQuery>
        )}
      </ProfileQuery>
    );
  }
  public handleRideAcceptance = (data: acceptRide) => {
    const { history } = this.props;
    const { UpdateRideStatus } = data;
    if (UpdateRideStatus.ok) {
      history.push(`/ride/${UpdateRideStatus.rideId}`);
    }
  };

  public handleProfileQuery = (data: userProfile) => {
    if (this.state.isDriving === undefined) {
      const { GetMyProfile } = data;
      if (GetMyProfile.user) {
        const {
          user: { isDriving }
        } = GetMyProfile;
        this.setState({
          isDriving
        });
      }
    }
  };

  public handleRideRequest = (data: requestRide) => {
    const { RequestRide } = data;
    const { history } = this.props;
    if (RequestRide.ok) {
      toast.success("Drive requested,finding a driver");
      history.push(`/ride/${RequestRide.ride!.id}`);
    } else {
      toast.error(RequestRide.error);
    }
  };
  public handleGeoSucces = (position: Position) => {
    console.log("geo success!");
    const {
      coords: { latitude, longitude }
    } = position;
    this.setState({
      lat: latitude,
      lng: longitude
    });
    this.getFromAddress(latitude, longitude);
    this.loadMap(latitude, longitude);
  };

  public getFromAddress = async (lat, lng) => {
    const fromAddress = await reverseGeoCode(lat, lng);
    if (fromAddress) {
      this.setState({
        fromAddress
      });
    }
  };
  public handleGeoWatchSucces = (position: Position) => {
    const { reportLocation } = this.props;
    const {
      coords: { latitude, longitude }
    } = position;
    this.userMarker.setPosition({ lat: latitude, lng: longitude });
    this.map.panTo({ lat: latitude, lng: longitude });
    reportLocation({
      variables: {
        lat: latitude,
        lng: longitude
      }
    });
  };
  public handleGeoError = () => {
    console.log("No location");
  };
  public handleGeoWatchError = () => {
    console.log("Error watching you");
  };
  public loadMap = (lat, lng) => {
    console.log(lat, lng);
    const { google } = this.props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
    const mapConfig: google.maps.MapOptions = {
      center: {
        lat,
        lng
      },
      disableDefaultUI: true,
      zoom: 15
    };
    this.map = new google.maps.Map(mapNode, mapConfig);
    const userMarkerOptions: google.maps.MarkerOptions = {
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 7
      },
      position: {
        lat,
        lng
      }
    };
    this.userMarker = new maps.Marker(userMarkerOptions);
    this.userMarker.setMap(this.map);
    const watchOptions: PositionOptions = {
      enableHighAccuracy: true
    };
    navigator.geolocation.watchPosition(
      this.handleGeoWatchSucces,
      this.handleGeoWatchError,
      watchOptions
    );
  };

  public toggleMenu = () => {
    this.setState(state => {
      return {
        isMenuOpen: !state.isMenuOpen
      };
    });
  };
  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };
  public onAddressSubmit = async () => {
    const { toAddress } = this.state;
    const { google } = this.props;
    const maps = google.maps;
    const result = await geoCode(toAddress);
    if (result !== false) {
      const { lat, lng, formatted_address: formattedAddress } = result;

      if (this.toMarker) {
        this.toMarker.setMap(null);
      }
      const toMarkerOptions: google.maps.MarkerOptions = {
        position: {
          lat,
          lng
        }
      };
      this.toMarker = new maps.Marker(toMarkerOptions);
      this.toMarker.setMap(this.map);

      // zoom out to view both origin and destination
      const bounds = new maps.LatLngBounds();
      bounds.extend({ lat, lng });
      bounds.extend({ lat: this.state.lat, lng: this.state.lng });
      this.map.fitBounds(bounds);
      this.setState(
        {
          toAddress: formattedAddress,
          toLat: lat,
          toLng: lng
        },
        this.createPath
      );
    }
  };
  public createPath = () => {
    const { toLat, toLng, lat, lng } = this.state;
    if (this.directions) {
      this.directions.setMap(null);
    }
    const renderOptions: google.maps.DirectionsRendererOptions = {
      polylineOptions: {
        strokeColor: "#000"
      },
      suppressMarkers: true
    };
    this.directions = new google.maps.DirectionsRenderer(renderOptions);
    const directionService: google.maps.DirectionsService = new google.maps.DirectionsService();
    const to = new google.maps.LatLng(toLat, toLng);
    const from = new google.maps.LatLng(lat, lng);
    const directionsOptions: google.maps.DirectionsRequest = {
      destination: to,
      origin: from,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionService.route(directionsOptions, this.handleRouteRequest);
  };
  public handleRouteRequest = (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      console.log(result);
      const { routes } = result;
      const {
        distance: { text: distance },
        duration: { text: duration }
      } = routes[0].legs[0];

      this.directions.setDirections(result);
      this.directions.setMap(this.map);
      this.setState(
        {
          distance,
          duration
        },
        this.setPrice
      );
    } else {
      toast.error("There is no route there, you have to swim");
    }
  };

  public setPrice = () => {
    const { distance } = this.state;
    if (distance) {
      this.setState({
        price: Number(parseFloat(distance.replace(",", "")) * 3).toFixed(2)
      });
    }
  };
  public handleNearbyDrivers = (data: {} | getDrivers) => {
    if ("GetNearbyDrivers" in data) {
      const {
        GetNearbyDrivers: { drivers, ok }
      } = data;
      if (ok && drivers) {
        for (const driver of drivers) {
          if (driver && driver.lastLat && driver.lastLng) {
            const existingDriver:
              | google.maps.Marker
              | undefined = this.drivers.find(
              (driverMarker: google.maps.Marker) => {
                const markerID = driverMarker.get("ID");
                return markerID === driver.id;
              }
            );
            if (existingDriver) {
              existingDriver.setPosition({
                lat: driver.lastLat,
                lng: driver.lastLng
              });
              existingDriver.setMap(this.map);
            } else {
              const markerOptions: google.maps.MarkerOptions = {
                icon: {
                  path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                  scale: 5
                },
                position: {
                  lat: driver.lastLat,
                  lng: driver.lastLng
                }
              };
              const newMarker: google.maps.Marker = new google.maps.Marker(
                markerOptions
              );
              this.drivers.push(newMarker);
              newMarker.set("ID", driver.id);
              newMarker.setMap(this.map);
            }
          }
        }
      }
    }
  };
}

export default graphql<any, reportMovement, reportMovementVariables>(
  REPORT_LOCATION,
  {
    name: "reportLocation"
  }
)(HomeContainer);
