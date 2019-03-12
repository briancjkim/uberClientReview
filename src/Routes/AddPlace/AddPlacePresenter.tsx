import React from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import styeld from "../../typed-components";
import Header from "../../Components/Header";
import Form from "../../Components/Form";
import Input from "../../Components/Input";
import styled from "../../typed-components";
import Button from "../../Components/Button";
import { MutationFn } from "react-apollo";

const Container = styeld.div`
  paddign:0 40px;
`;
const ExtendedInput = styeld(Input)`
  margin-bottom:40px;
`;
const ExtendedLink = styled(Link)`
  text-decoration: underline;
  margin-bottom: 20px;
  display: block;
`;

interface IProps {
  name: string;
  address: string;
  onSubmit: MutationFn;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  pickedAddress: boolean;
}
const AddPlacePresenter: React.SFC<IProps> = ({
  name,
  address,
  onInputChange,
  loading,
  onSubmit,
  pickedAddress
}) => (
  <React.Fragment>
    <Helmet>
      <title>Add Place | Nuber</title>
    </Helmet>
    <Header title={"Add Place"} backTo={"/"} />
    <Container>
      <Form submitFn={onSubmit}>
        <ExtendedInput
          placeholder={"Name"}
          type={"text"}
          onChange={onInputChange}
          value={name}
          name={"name"}
        />
        <ExtendedInput
          placeholder={"Address"}
          type={"text"}
          onChange={onInputChange}
          value={address}
          name={"address"}
        />
        <ExtendedLink to={"/find-address"}>Pick place from map</ExtendedLink>
        {pickedAddress && (
          <Button
            onClick={null}
            value={loading ? "Adding place" : "Add place"}
          />
        )}
      </Form>
    </Container>
  </React.Fragment>
);

export default AddPlacePresenter;
