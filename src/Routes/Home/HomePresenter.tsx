import React from "react";
import Sidebar from "react-sidebar";
import Helmet from "react-helmet";
import styled from "../../typed-components";
import Menu from "../../Components/Menu";
import Button from "../../Components/Button";
import AddressBar from "../../Components/AddressBar";
import { userProfile, getRides } from "../../types/api";
import { MutationFn } from "react-apollo";
import RidePopUp from "../../Components/RidePopUp";
const Container = styled.div``;

const MenuButton = styled.button`
  appearance: none;
  padding: 10px;
  position: absolute;
  top: 10px;
  left: 10px;
  text-align: center;
  font-weight: 800;
  border: 0;
  cursor: pointer;
  font-size: 20px;
  transform: rotate(90deg);
  z-index: 2;
  background-color: transparent;
`;
const ExtendedButton = styled(Button)`
  position: absolute;
  bottom: 50px;
  width: 80%;
  height: auto;
  margin: auto;
  left: 0;
  right: 0;
  z-index: 2;
  opacity: 0.7;
`;
const RequestButton = styled(ExtendedButton)`
  bottom 120px
`;
const Map = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

interface IProps {
  isMenuOpen: boolean;
  loading: boolean;
  toggleMenu: () => void;
  mapRef: any;
  toAddress: string;
  onAddressSubmit: () => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  price?: string;
  data?: userProfile;
  requestRideFn?: MutationFn;
  nearbyRide?: getRides;
  acceptRideFn?: MutationFn;
}

const HomePresenter: React.SFC<IProps> = ({
  isMenuOpen,
  toggleMenu,
  loading,
  mapRef,
  toAddress,
  onInputChange,
  onAddressSubmit,
  price,
  data,
  requestRideFn,
  nearbyRide,
  acceptRideFn
}) => {
  const { GetMyProfile: { user = null } = {} } = data || {};

  const { GetNearbyRide: { ride = null } = {} } = nearbyRide || {};

  return (
    <Container>
      <Helmet>
        <title>Home | Nuber</title>
      </Helmet>
      <Sidebar
        sidebar={<Menu />}
        open={isMenuOpen}
        onSetOpen={toggleMenu}
        styles={{
          sidebar: {
            background: "white",
            width: "80%",
            zIndex: "10"
          }
        }}
      >
        {!loading && <MenuButton onClick={toggleMenu}>|||</MenuButton>}
        {user && !user.isDriving && (
          <React.Fragment>
            <AddressBar
              name={"toAddress"}
              onChange={onInputChange}
              value={toAddress}
              onBlur={onAddressSubmit}
            />
            <ExtendedButton
              onClick={onAddressSubmit}
              disabled={toAddress === ""}
              value={price ? "change address" : "Pick Address"}
            />
          </React.Fragment>
        )}
        {price && (
          <RequestButton
            onClick={requestRideFn}
            disabled={toAddress === ""}
            value={`Request Ride ($${price})`}
          />
        )}
        {ride && (
          <RidePopUp
            id={ride.id}
            pickUpAddress={ride.pickUpAddress}
            dropOffAddress={ride.dropOffAddress}
            price={ride.price}
            distance={ride.distance}
            passengerName={ride.passenger.fullName!}
            passengerPhoto={ride.passenger.profilePhoto!}
            acceptRideFn={acceptRideFn}
          />
        )}
        <Map ref={mapRef} />
      </Sidebar>
    </Container>
  );
};

export default HomePresenter;
