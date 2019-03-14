import React from "react";
import { getPlaces } from "../../types/api";
import Helmet from "react-helmet";
import styled from "../../typed-components";
import Header from "../../Components/Header";
import PlacesContainer from "./PlacesContainer";
import { Link } from "react-router-dom";
import Place from "../../Components/Place";

const Container = styled.div`
  padding: 0 40px;
`;

const SLink = styled(Link)`
  text-decoration: underline;
`;

interface IProps {
  data?: getPlaces;
  loading: boolean;
}
const PlacePresenter: React.SFC<IProps> = ({ data, loading }) => {
  const GetMyPlaces = data!.GetMyPlaces || {};
  const places = GetMyPlaces.places;
  console.log(data);
  return (
    <React.Fragment>
      <Helmet>
        <title>Places | Number</title>
      </Helmet>
      <Header title={"Places"} backTo={"/"} />
      <Container>
        {!loading && places && places.length === 0 && "You have no places"}
        {!loading &&
          places &&
          places.map(place => (
            <Place
              id={place!.id}
              key={place!.id}
              fav={place!.isFav}
              name={place!.name}
              address={place!.address}
            />
          ))}
        <SLink to={"/add-place"}>Please add some places!</SLink>
      </Container>
    </React.Fragment>
  );
};

export default PlacePresenter;
