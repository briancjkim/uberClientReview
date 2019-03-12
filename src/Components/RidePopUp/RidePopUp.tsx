import React from "react";
import styled from "../../typed-components";
import Button from "../Button";

const Container = styled.div`
  background-color: white;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 80%;
  height: 70%;
  z-index: 9;
  padding: 20px;
`;

const Title = styled.h4`
  font-weight: 800;
  margin-top: 30px;
  margin-bottom: 10px;
  &:first-child {
    margin-top: 0;
  }
`;
const Data = styled.span`
  color: ${props => props.theme.blueColor};
`;
const Passenger = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Img = styled.img`
  border-radius: 50%;
  height: 50px;
  width: 50px;
  margin-right: 20px;
`;

interface IProps {
  pickUpAddress: string;
  dropOffAddress: string;
  price: number;
  distance: string;
  passengerName: string;
  passengerPhoto: string;
  acceptRideFn: any;
  id: number;
}
const RidePopUp: React.SFC<IProps> = ({
  pickUpAddress,
  dropOffAddress,
  price,
  distance,
  passengerName,
  passengerPhoto,
  acceptRideFn,
  id
}) => (
  <Container>
    <Title>Pick Up Address</Title>
    <Data>{pickUpAddress}</Data>
    <Title>Drop Off Address</Title>
    <Data>{dropOffAddress}</Data>
    <Title>Price</Title>
    <Data>{price}</Data>
    <Title>Distance</Title>
    <Data>{distance}</Data>
    <Title>Passenger:</Title>
    <Passenger>
      <Img src={passengerPhoto} />
      <Data>{passengerName}</Data>
    </Passenger>
    <Button
      onClick={() => acceptRideFn({ variables: { rideId: id } })}
      value={"Accept Ride"}
    />
  </Container>
);

export default RidePopUp;
