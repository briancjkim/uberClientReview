import React from "react";
import ReactDOM from "react-dom";
import FindAddressPresenter from "./FindAddressPresenter";
import { reverseGeoCode, geoCode } from "../../mapHelpers";
import { RouteComponentProps } from "react-router";

interface IState {
  lat: number;
  lng: number;
  address: string;
}
interface IProps extends RouteComponentProps<any> {
  google: any;
}
class FindAddressContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map;
  public state = {
    lat: 0,
    lng: 0,
    address: ""
  };
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }
  public componentDidMount() {
    console.log("component Did Mount!");
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSucces,
      this.handleGeoError,
      { maximumAge: Infinity, timeout: 5000, enableHighAccuracy: true }
    );
  }
  public render() {
    const { address } = this.state;
    return (
      <FindAddressPresenter
        onPickPlace={this.onPickPlace}
        mapRef={this.mapRef}
        address={address}
        onInputChange={this.onInputChange}
        onInputBlur={this.onInputBlur}
      />
    );
  }
  public handleGeoSucces: PositionCallback = (positon: Position) => {
    console.log("called geo success!");
    const {
      coords: { latitude, longitude }
    } = positon;
    this.setState({
      lat: latitude,
      lng: longitude
    });
    this.loadMap(latitude, longitude);
    this.reverseGeoCodeAddress(latitude, longitude);
  };
  public handleGeoError: PositionErrorCallback = () => {
    console.log("No location");
  };
  public loadMap = (lat, lng) => {
    const { google } = this.props;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
    console.log(this.mapRef);
    console.log(mapNode);
    const mapConfig: google.maps.MapOptions = {
      center: {
        lat,
        lng
      },
      disableDefaultUI: true,
      zoom: 15
    };
    this.map = new google.maps.Map(mapNode, mapConfig);
    this.map.addListener("dragend", this.handleDragEnd);
  };
  public handleDragEnd = () => {
    const newCenter = this.map.getCenter();
    const lat = newCenter.lat();
    const lng = newCenter.lng();

    this.setState({
      lat,
      lng
    });
    this.reverseGeoCodeAddress(lat, lng);
  };
  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };
  public onInputBlur = async () => {
    const { address } = this.state;
    const result = await geoCode(address);
    if (result !== false) {
      const { lat, lng, formatted_address: formattedAddress } = result;
      this.setState({
        address: formattedAddress,
        lat,
        lng
      });
      this.map.panTo({ lat, lng });
    }
  };
  public reverseGeoCodeAddress = async (lat: number, lng: number) => {
    const reversedAddress = await reverseGeoCode(lat, lng);
    if (reversedAddress !== false) {
      this.setState({
        address: reversedAddress
      });
    }
  };
  public onPickPlace = () => {
    const { address, lat, lng } = this.state;
    const { history } = this.props;
    history.push({
      pathname: "/add-place",
      state: {
        address,
        lat,
        lng
      }
    });
    console.log(address, lat, lng);
  };
}

export default FindAddressContainer;
