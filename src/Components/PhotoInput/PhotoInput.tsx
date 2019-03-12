import React from "react";
import styled from "../../typed-components";

const Container = styled.div``;
const Input = styled.input`
  color: white;
  opacity: 0;
  height: 1px;
  &:focus {
    outline: none;
  }
`;
const Image = styled.label`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: block;
  cursor: pointer;
  border: 2px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  overflow: hidden;
  & img {
    width: 80px;
    height: 80px;
  }
`;

interface IProps {
  uploading: boolean;
  fileUrl: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const PhotoInput: React.SFC<IProps> = ({ uploading, fileUrl, onChange }) => (
  <Container>
    <Input id={"photo"} type="file" accept="image/*" onChange={onChange} />
    <Image htmlFor="photo">
      {uploading && "⏰"}
      {!uploading && <img src={fileUrl} />}
    </Image>
  </Container>
);

export default PhotoInput;
