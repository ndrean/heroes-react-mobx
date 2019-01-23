import { decorate, observable, action, computed } from "mobx";
import { Hero } from "../models/hero";
import {
  addHero,
  getHero,
  getHeroes,
  removeHero,
  updateHero
} from "./hero-service";
import { toJS } from "mobx";

class HeroStore {
  heroes: Hero[] = [];
  hero: Hero = {} as Hero;
  error: string = "";
  fetching: boolean = false;

  loadHeroes = async () => {
    try {
      const { data } = await getHeroes();
      this.heroes = data.reverse();
    } catch (e) {
      this.error = `${e.response.status} error`;
    }
  };

  loadHero = async (id: string) => {
    try {
      const { data } = await getHero(id);
      this.hero = data;
    } catch (e) {
      this.error = `${e.response.status} error`;
    }
  };

  postHero = async (hero: Hero) => {
    try {
      await addHero(hero).then(() => this.heroes.unshift(hero));
    } catch (e) {
      this.error = `${e.response.status} error`;
    }
  };

  putHero = async (hero: Hero) => {
    try {
      await updateHero(hero);
      // Applicable if a component(s) of the current page is rendering the array of heroes
      // This will update the properties hero inside the array of heroes
      const index = this.heroes.findIndex(h => h.id === hero.id);
      this.heroes[index] = hero;
    } catch (e) {
      this.error = `${e.response.status} error`;
    }
  };

  deleteHero = async (id: string) => {
    try {
      await removeHero(id);
      const index = this.heroes.findIndex(h => h.id === id);
      this.heroes.splice(index, 1);
    } catch (e) {
      this.error = `${e.response.status} error`;
    }
  };
}

decorate(HeroStore, {
  heroes: observable,
  hero: observable,
  error: observable,
  fetching: observable,
  loadHeroes: action,
  loadHero: action,
  postHero: action,
  putHero: action,
  deleteHero: action
});

const heroStore = new HeroStore();
export default heroStore;
