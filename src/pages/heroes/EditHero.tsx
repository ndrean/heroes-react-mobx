import * as React from "react";
import { Hero } from "../../models/hero";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import heroStore from "../../stores/hero.store";

export interface EditHeroProps {
  heroStore: typeof heroStore;
  history: any;
  match: any;
}

export interface EditHeroState {
  isSuccess: boolean;
  hero: Hero;
}

class EditHero extends React.Component<EditHeroProps, EditHeroState> {
  state = {
    isSuccess: false,
    hero: {
      id: "",
      firstName: "",
      lastName: "",
      house: "",
      knownAs: ""
    } as Hero
  };

  async componentDidMount() {
    await heroStore.loadHero(this.props.match.params.id);
    this.setState({ hero: heroStore.hero });
    console.log(toJS(this.state.hero));
  }

  handleInputChange = ({
    currentTarget: input
  }: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = input;
    this.setState({
      hero: {
        ...this.state.hero,
        [name]: value
      }
    });

    // OR
    // const updatedHero: Hero = { ...this.state.hero };
    // const { name, value } = currentTarget;
    // updatedHero[name] = value;
    // this.setState({
    //   hero: updatedHero
    // });
  };

  handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    heroStore.putHero(this.state.hero);

    this.setState({ isSuccess: !this.state.isSuccess });
  };

  handleBackButton = () => {
    this.props.history.goBack();
  };

  public render() {
    const { firstName, lastName, house, knownAs } = this.state.hero;
    const { isSuccess } = this.state;

    return (
      <>
        <h2>Edit Hero</h2>
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
            This hero has been updated!
          </div>
        )}
      </>
    );
  }
}

export default inject("heroStore")(observer(EditHero));
