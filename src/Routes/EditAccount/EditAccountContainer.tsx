import React from "react";
import { RouteComponentProps } from "react-router";
import { updateProfile, userProfile } from "../../types/api";
import { Mutation, Query } from "react-apollo";
import EditAccountPresenter from "./EditAccountPresenter";
import { UPDATE_PROFILE } from "./EditAccountQueries";
import { USER_PROFILE } from "../../sharedQueriesLocal";
import { toast } from "react-toastify";
import axios from "axios";

interface IProps extends RouteComponentProps<any> {}
interface IState {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  uploading: boolean;
}

class ProfileQuery extends Query<userProfile> {}
class UpdateProfileMutation extends Mutation<updateProfile> {}
class EditAccountContainer extends React.Component<IProps, IState> {
  public state = {
    firstName: "",
    lastName: "",
    email: "",
    profilePhoto: "",
    uploading: false
  };

  public render() {
    const { firstName, lastName, email, profilePhoto, uploading } = this.state;
    return (
      <ProfileQuery
        query={USER_PROFILE}
        fetchPolicy={"cache-and-network"}
        onCompleted={this.updateFields}
      >
        {() => (
          <UpdateProfileMutation
            mutation={UPDATE_PROFILE}
            variables={{
              firstName,
              lastName,
              email,
              profilePhoto
            }}
            refetchQueries={[{ query: USER_PROFILE }]}
            onCompleted={data => {
              const { UpdateMyProfile } = data;
              if (UpdateMyProfile.ok) {
                toast.success("Profile updated!");
              } else {
                toast.error(UpdateMyProfile.error);
              }
            }}
          >
            {(updateProfileFn, { loading }) => (
              <EditAccountPresenter
                email={email}
                firstName={firstName}
                lastName={lastName}
                profilePhoto={profilePhoto}
                onInputChange={this.onInputChange}
                loading={loading}
                onSubmit={updateProfileFn}
                uploading={uploading}
              />
            )}
          </UpdateProfileMutation>
        )}
      </ProfileQuery>
    );
  }
  public updateFields = (data: userProfile) => {
    const { firstName } = this.state;
    if (firstName === "" || null) {
      if ("GetMyProfile" in data) {
        const {
          GetMyProfile: { user }
        } = data;
        if (user !== null) {
          const {
            firstName: userFirstName,
            lastName,
            email,
            profilePhoto
          } = user;
          this.setState({
            email,
            firstName: userFirstName,
            lastName,
            profilePhoto,
            uploaded: profilePhoto !== null
          } as any);
        }
      }
    }
  };
  public onInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async event => {
    const {
      target: { name, value, files }
    } = event;
    if (files) {
      this.setState({
        uploading: true
      });
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("api_key", "428723349232839");
      formData.append("upload_preset", "x60kir21");
      formData.append("timestamp", String(Date.now() / 1000));
      const {
        data: { secure_url }
      } = await axios.post(
        "https://api.cloudinary.com/v1_1/drt5crzjr/image/upload",
        formData
      );
      if (secure_url) {
        this.setState({
          profilePhoto: secure_url,
          uploading: false
        });
      }
    }
    this.setState({
      [name]: value
    } as any);
  };
}
export default EditAccountContainer;
