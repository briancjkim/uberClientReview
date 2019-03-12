import React from "react";
import Header from "../../Components/Header";
import styled from "../../typed-components";
import { getChat, userProfile } from "../../types/api";

import Message from "../../Components/Message";
import Form from "../../Components/Form";
import Input from "../../Components/Input";
const Container = styled.div``;

const Chat = styled.div`
  height: 80vh;
  overflow: scroll;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const InputCont = styled.div`
  padding: 0 20px;
`;

interface IProps {
  data?: getChat;
  userData?: userProfile;
  loading: boolean;
  messageText: string;
  onInputChange: (event: any) => void;
  onSubmit: () => void;
}
const ChatPresenter: React.SFC<IProps> = ({
  data,
  userData,
  loading,
  messageText,
  onInputChange,
  onSubmit
}) => {
  const { GetMyProfile: { user = null } = {} } = userData || {};
  const { GetChat: { chat = null } = {} } = data || {};
  console.log(chat);
  return (
    <Container>
      <Header title={"Chat"} />
      {!loading && chat && user && (
        <React.Fragment>
          <Chat>
            {chat.messages &&
              chat.messages.map(message => {
                if (message) {
                  return "sibaroma";
                }
                return null;
              })}
          </Chat>
          <InputCont>
            <Form submitFn={onSubmit}>
              <Input
                placeholder={"Type your message"}
                name={"message"}
                value={messageText}
                onChange={onInputChange}
              />
            </Form>
          </InputCont>
        </React.Fragment>
      )}
    </Container>
  );
};

export default ChatPresenter;
