import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ChatPresenter from "./ChatPresenter";
import { Query, Mutation, MutationFn } from "react-apollo";
import {
  getChat,
  getChatVariables,
  userProfile,
  sendMessage,
  sendMessageVariables
} from "../../types/api";
import { USER_PROFILE } from "../../sharedQueriesLocal";
import { GET_CHAT, SEND_MESSAGE } from "./ChatQueries";

interface IProps extends RouteComponentProps<any> {}
interface IState {
  message: string;
}
class ProfileQuery extends Query<userProfile> {}
class ChatQuery extends Query<getChat, getChatVariables> {}
class SendMessageMutation extends Mutation<sendMessage, sendMessageVariables> {}

class ChatContainer extends React.Component<IProps, IState> {
  public sendMessageFn: MutationFn;
  constructor(props: IProps) {
    super(props);
    if (!props.match.params.chatId) {
      props.history.push("/");
    }
    this.state = {
      message: ""
    };
  }
  public render() {
    const {
      match: {
        params: { chatId }
      }
    } = this.props;
    const { message } = this.state;
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => (
          <ChatQuery
            query={GET_CHAT}
            variables={{ chatId: parseInt(chatId, 10) }}
          >
            {({ data, loading }) => (
              <SendMessageMutation mutation={SEND_MESSAGE}>
                {sendMessageFn => {
                  this.sendMessageFn = sendMessageFn;

                  return (
                    <ChatPresenter
                      data={data}
                      loading={loading}
                      userData={userData}
                      messageText={message}
                      onInputChange={this.onInputChange}
                      onSubmit={this.onSubmit}
                    />
                  );
                }}
              </SendMessageMutation>
            )}
          </ChatQuery>
        )}
      </ProfileQuery>
    );
  }
  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };
  public onSubmit = () => {
    const { message } = this.state;
    const {
      match: {
        params: { chatId }
      }
    } = this.props;
    if (message !== "") {
      this.setState({
        message: ""
      });
      this.sendMessageFn({
        variables: {
          chatId: parseInt(chatId, 10),
          text: message
        }
      });
    }
    return;
  };
}

export default ChatContainer;
