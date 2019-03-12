import React from "react";
import { MutationFn } from "react-apollo";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import Header from "../../Components/Header";

import styled from "../../typed-components";
import { userProfile, getPlaces } from "../../types/api";
import Place from "../../Components/Place";

const Container = styled.div`
  padding: 0px 40px;
`;

const Image = styled.img`
  height: 60px;
  width: 60px;
  border-radius: 50%;
`;

const GridLink = styled(Link)`
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-gap: 10px;
  margin-bottom: 10px;
`;

const Keys = styled.div``;

const Key = styled.span`
  display: block;
  margin-bottom: 5px;
`;

const FakeLink = styled.span`
  text-decoration: underline;
  cursor: pointer;
`;

const SLink = styled(Link)`
  display: block;
  text-decoration: underline;
  margin: 20px 0px;
`;

interface IProps {
  logUserOut: MutationFn;
  userData?: userProfile;
  userDataLoading: boolean;
  placesData?: getPlaces;
  placesDataLoading: boolean;
}

const SettingsPresenter: React.SFC<IProps> = ({
  logUserOut,
  userData,
  userDataLoading,
  placesData,
  placesDataLoading
}) => {
  const GetMyProfile = userData!.GetMyProfile;
  const GetMyPlaces = placesData!.GetMyPlaces;
  return (
    <React.Fragment>
      <Helmet>
        <title>Settings | Nuber</title>
      </Helmet>
      <Header title={"Account Settings"} backTo={"/"} />
      <Container>
        <GridLink to={"/edit-account"}>
          {!userDataLoading &&
            GetMyProfile.user &&
            GetMyProfile.user.profilePhoto &&
            GetMyProfile.user.email &&
            GetMyProfile.user.fullName && (
              <React.Fragment>
                <Image src={GetMyProfile.user.profilePhoto} />
                <Keys>
                  <Key>{GetMyProfile.user.fullName}</Key>
                  <Key>{GetMyProfile.user.email}</Key>
                </Keys>
              </React.Fragment>
            )}
        </GridLink>
        {!placesDataLoading &&
          GetMyPlaces.places &&
          GetMyPlaces.places.map(place => (
            <Place
              key={place!.id}
              id={place!.id}
              fav={place!.isFav}
              name={place!.name}
              address={place!.address}
            />
          ))}
        <SLink to={"/places"}>Go to Places</SLink>
        <FakeLink onClick={logUserOut as any}>Log Out</FakeLink>
      </Container>
    </React.Fragment>
  );
};

export default SettingsPresenter;
