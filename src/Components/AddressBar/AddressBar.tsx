import React from "react";
import styled from "../../typed-components";

const Container = styled.input`
  position: absolute;
  backgroundcolor: white;
  border-radius: 5px;
  z-index: 2;
  -webkit-appearance: none;
  width: 80%;
  border: none;
  font-size: 16px;
  padding: 15px 10px;
  margin: auto;
  left: 0;
  right: 0;
  height: auto;
  box-shadow: 0 18px 35px rgba(50, 50, 93, 0.1), 0 8px 15px rgba(0, 0, 0, 0.07);
`;

interface IProps {
  onBlur: () => void;
  value: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const AddressBar: React.SFC<IProps> = ({ onBlur, value, name, onChange }) => (
  <Container
    value={value}
    onBlur={onBlur}
    onSubmit={onBlur}
    name={name}
    placeholder={"Type address"}
    onChange={onChange}
  />
);
export default AddressBar;
