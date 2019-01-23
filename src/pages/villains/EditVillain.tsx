import * as React from "react";

import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import villainStore from "../../stores/villain.store";
import { Villain } from "../../models/villain";

export interface EditVillainProps {
  villainStore: typeof villainStore;
  history: any;
  match: any;
}

export interface EditVillainState {
  isSuccess: boolean;
  villain: Villain;
}

class EditVillain extends React.Component<EditVillainProps, EditVillainState> {
  state = {
    isSuccess: false,
    villain: {
      id: "",
      firstName: "",
      lastName: "",
      house: "",
      knownAs: ""
    } as Villain
  };

  async componentDidMount() {
    await villainStore.loadVillain(this.props.match.params.id);
    this.setState({ villain: villainStore.villain });
    console.log(toJS(this.state.villain));
  }

  handleInputChange = ({
    currentTarget: input
  }: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = input;
    this.setState({
      villain: {
        ...this.state.villain,
        [name]: value
      }
    });

    // OR
    // const updatedVillain: villain = { ...this.state.villain };
    // const { name, value } = currentTarget;
    // updatedVillain[name] = value;
    // this.setState({
    //   villain: updatedVillain
    // });
  };

  handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    villainStore.putVillain(this.state.villain);

    this.setState({ isSuccess: !this.state.isSuccess });
  };

  handleBackButton = () => {
    this.props.history.goBack();
  };

  public render() {
    const { firstName, lastName, house, knownAs } = this.state.villain;
    const { isSuccess } = this.state;

    return (
      <>
        <h2>Edit villain</h2>
        <div className="card my-3" style={{ width: "auto" }}>
          <form className="card-header" onSubmit={this.handleSubmit}>
            <section className="d-flex flex-row">
              <div className="mt-3 mr-3 input-width">
                <label htmlFor="firstName">First Name</label>
                <input
                  name="firstName"
                  value={firstName}
                  onChange={this.handleInputChange}
                  type="text"
                  id="firstName"
                  className="form-control"
                />
              </div>
              <div className="mt-3 ml-3 input-width">
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={lastName}
                  onChange={this.handleInputChange}
                  type="text"
                  id="lastName"
                  className="form-control"
                />
              </div>
            </section>
            <label className="mt-3">House</label>
            <input
              name="house"
              value={house}
              onChange={this.handleInputChange}
              type="text"
              id="house"
              className="form-control"
            />
            <label className="mt-3">Known as</label>
            <input
              name="knownAs"
              value={knownAs}
              onChange={this.handleInputChange}
              type="text"
              id="knownAs"
              className="form-control"
            />
            <button
              type="submit"
              disabled={isSuccess}
              className="btn btn-info mt-3"
            >
              Update
            </button>
            <button
              onClick={this.handleBackButton}
              type="button"
              className="btn btn-default mt-3"
            >
              Back
            </button>
          </form>
        </div>
        {isSuccess && (
          <div className="alert alert-success col-md-3" role="alert">
            This villain has been updated!
          </div>
        )}
      </>
    );
  }
}

export default inject("villainStore")(observer(EditVillain));
