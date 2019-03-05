import React from 'react';
import { RouteComponentProps } from 'react-router';
import VerifyPhonePresenter from './VerifyPhonePresenter';
import { Mutation } from 'react-apollo';
import { verifyPhone, verifyPhoneVariables } from '../../types/api';
import { VERIFY_PHONE } from './VerifyPhoneQueries';
import { toast } from 'react-toastify';

interface IProps extends RouteComponentProps<any> { }
interface IState {
  verificationKey: string;
  phoneNumber
}

class VerifyMutation extends Mutation<verifyPhone, verifyPhoneVariables>{ }

class VerifyPhoneContainer extends React.Component<IProps, IState>{

  constructor(props: IProps) {
    super(props);
    if (!props.location.state) {
      props.history.push("/");
    }
    this.state = {
      verificationKey: "",
      phoneNumber: props.location.state.phone
    }
  }
  public render() {
    const { verificationKey, phoneNumber } = this.state;
    return (
      <VerifyMutation
        mutation={VERIFY_PHONE}
        variables={{
          phoneNumber,
          key: verificationKey
        }}
        onCompleted={data => {
          const { CompletePhoneVerification } = data;
          if (CompletePhoneVerification.ok) {
            toast.success("You're verified, Loggin in now");
          } else {
            toast.error(CompletePhoneVerification.error);
          }
        }}
      >
        {(mutation, { loading }) => (
          <VerifyPhonePresenter
            onChange={this.onInputChange}
            verificationKey={verificationKey}
            onSubmit={mutation}
            loading={loading}
          />)
        }
      </VerifyMutation>
    )
  }
  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  }
}

export default VerifyPhoneContainer;