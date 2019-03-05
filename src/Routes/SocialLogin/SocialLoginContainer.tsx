import React from "react";
import SocialLoginPresenter from "./SocialLoginPresenter";
import { facebookConnect, facebookConnectVariables } from "../../types/api";
import { Mutation, MutationFn } from "react-apollo";
import { FACEBOOK_CONNECT } from "./SocialLoginQueries";
import { RouteComponentProps } from "react-router";
import { toast } from "react-toastify";
import { LOG_USER_IN } from "../../sharedQueries";

class LoginMutation extends Mutation<
  facebookConnect,
  facebookConnectVariables
> {}
interface IProps extends RouteComponentProps<any> {}
interface IState {
  firstName: string;
  lastName: string;
  email?: string;
  fbId: string;
}
class SocialLoginContainer extends React.Component<IProps, IState> {
  public facebookMutation: MutationFn;
  public state = {
    email: "",
    firstName: "",
    lastName: "",
    fbId: ""
  };
  public render() {
    return (
      <Mutation mutation={LOG_USER_IN}>
        {logUserIn => (
          <LoginMutation
            mutation={FACEBOOK_CONNECT}
            onCompleted={data => {
              const { FacebookConnect } = data;
              if (FacebookConnect.ok) {
                logUserIn({
                  variables: {
                    token: FacebookConnect.token
                  }
                });
              } else {
                toast.error(FacebookConnect.error);
              }
            }}
          >
            {(facebookMutation, { loading }) => {
              this.facebookMutation = facebookMutation;
              return (
                <SocialLoginPresenter loginCallback={this.loginCallback} />
              );
            }}
          </LoginMutation>
        )}
      </Mutation>
    );
  }
  public loginCallback = response => {
    const { name, first_name, last_name, email, id, accessToken } = response;
    if (accessToken) {
      toast.success(`Welcome ${name}!`);
      console.log(response);
      this.facebookMutation({
        variables: {
          email,
          fbId: id,
          firstName: first_name,
          lastName: last_name
        }
      });
    } else {
      toast.error("Could not log you in :(");
    }
  };
}

export default SocialLoginContainer;
