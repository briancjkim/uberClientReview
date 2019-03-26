import React from "react";
import { RouteComponentProps } from "react-router";
import VerifyPhonePresenter from "./VerifyPhonePresenter";
import { Mutation, MutationFn } from "react-apollo";
import { verifyPhone, verifyPhoneVariables } from "../../types/api";
import { VERIFY_PHONE } from "./VerifyPhoneQueries";
import { toast } from "react-toastify";
import { LOG_USER_IN } from "../../sharedQueries";

interface IProps extends RouteComponentProps<any> {}
interface IState {
  verificationKey: string;
  phoneNumber;
}

class VerifyMutation extends Mutation<verifyPhone, verifyPhoneVariables> {}

class VerifyPhoneContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    if (!props.location.state) {
      props.history.push("/");
    }
    this.state = {
      verificationKey: "",
      phoneNumber: props.location.state.phone
    };
  }
  public render() {
    const { verificationKey, phoneNumber } = this.state;
    return (
      <Mutation mutation={LOG_USER_IN}>
        {logUserIn => (
          <VerifyMutation
            mutation={VERIFY_PHONE}
            variables={{
              phoneNumber,
              key: verificationKey
            }}
            onCompleted={data => {
              const { CompletePhoneVerification } = data;
              const { history } = this.props;
              if (CompletePhoneVerification.ok) {
                logUserIn({
                  variables: {
                    token: CompletePhoneVerification.token
                  }
                });
                toast.success("You're verified, Loggin in now");
                setTimeout(() => {
                  history.push({
                    pathname: "/"
                  });
                }, 2000);
              } else {
                toast.error(CompletePhoneVerification.error);
              }
            }}
          >
            {(verifyPhoneMutation, { loading }) => (
              <VerifyPhonePresenter
                onChange={this.onInputChange}
                verificationKey={verificationKey}
                onSubmit={verifyPhoneMutation}
                loading={loading}
              />
            )}
          </VerifyMutation>
        )}
      </Mutation>
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
}

export default VerifyPhoneContainer;
