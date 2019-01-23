import * as React from "react";
import { Hero } from "../../models/hero";
import NewItemForm from "../../common-components/NewItemForm";
import heroStore from "./../../stores/hero.store";

import { NavLink, Link } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import { render } from "react-dom";

export interface HeroesProps {
  heroStore: typeof heroStore;
}

export interface HeroesState {
  hero: Hero;
  isShowNewItemForm: boolean;
}

class Heroes extends React.Component<HeroesProps, HeroesState> {
  state = {
    isShowNewItemForm: false,
    hero: {
      id: "",
      firstName: "",
      lastName: "",
      house: "",
      knownAs: ""
    } as Hero
  };

  async componentDidMount() {
    const { heroStore } = this.props;
    await heroStore.loadHeroes();
  }

  removeItem = async (id: string, name: string) => {
    const isConfirmed = window.confirm(`Delete ${name}?`);
    if (!isConfirmed) return;
    await heroStore.deleteHero(id);
  };

  onChange = ({ currentTarget: input }: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = input;
    this.setState({
      hero: {
        ...this.state.hero,
        [name]: value
      }
    });

    // OR
    // const newHero = { ...this.state.hero };
    // const { name, value } = input;
    // newHero[name] = value;
    // this.setState({ hero: newHero });
  };

  onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    await heroStore
      .postHero(this.state.hero)
      .then(() => heroStore.loadHeroes());
    // .then(() => heroStore.loadHeroes());
    // is not necessary if you don't care about the id of the new created item
    // An id is required when deleting or getting an item

    const { isShowNewItemForm } = this.state;
    this.setState({ isShowNewItemForm: !isShowNewItemForm });
  };

  showNewItemForm = () => {
    const { isShowNewItemForm } = this.state;
    this.setState({ isShowNewItemForm: !isShowNewItemForm });
  };

  public render() {
    const { heroes, error } = heroStore;
    console.table(toJS(heroes)); // Mobx 5 uses proxies to implement the magic. toJS inspect the array
    return (
      <>
        <NewItemForm
          isShowNewItemForm={this.state.isShowNewItemForm}
          handleOnChange={this.onChange}
          handleOnSubmit={this.onSubmit}
          handleShowNewItemForm={this.showNewItemForm}
        />
        {error && (
          <div
            className="col-3 col-md-3 offset-9 alert alert-info"
            role="alert"
          >
            Something wrong happened: {toJS(error)}
          </div>
        )}
        {heroes.map(item => (
          <div key={item.id} className="card mt-3" style={{ width: "auto" }}>
            <div className="card-header">
              <h3 className="card-title">
                {item.firstName} {item.lastName}
              </h3>
              <h5 className="card-subtitle mb-2 text-muted">{item.house}</h5>
              <p className="card-text">{item.knownAs}</p>
            </div>
            <section className="card-body">
              <div className="row">
                <button
                  onClick={() => this.removeItem(item.id, item.firstName)}
                  className="btn btn-outline-danger card-link col text-center"
                >
                  <span className="fas fa-eraser  mr-2" />
                  Delete
                </button>
                <Link
                  to={`/edit-hero/${item.id}`}
                  className="btn btn-outline-primary card-link col text-center"
                >
                  <span className="fas fa-edit  mr-2" />
                  Edit
                </Link>
              </div>
            </section>
          </div>
        ))}
      </>
    );
  }
}

export default inject("heroStore")(observer(Heroes));
