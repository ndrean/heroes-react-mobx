import { decorate, observable, action, computed } from "mobx";
import { Villain } from "../models/villain";
import {
  addVillain,
  getVillain,
  getVillains,
  removeVillain,
  updateVillain
} from "./villain-service";

class VillainStore {
  villains: Villain[] = [];
  villain: Villain = {} as Villain;
  error: string = "";
  fetching: boolean = false;

  loadVillains = async () => {
    try {
      const { data } = await getVillains();
      this.villains = data.reverse();
    } catch (e) {
      this.error = `${e.response.status} error`;
    }
  };

  loadVillain = async (id: string) => {
    try {
      const { data } = await getVillain(id);
      this.villain = data;
    } catch (e) {
      this.error = `${e.response.status} error`;
    }
  };

  postVillain = async (villain: Villain) => {
    try {
      await addVillain(villain).then(() => this.villains.unshift(villain));
    } catch (e) {
      this.error = `${e.response.status} error`;
    }
  };

  putVillain = async (villain: Villain) => {
    try {
      await updateVillain(villain);
      // Applicable if a component(s) of the current page is rendering the array of villains
      // This will update the properties villain inside the array of villains
      const index = this.villains.findIndex(v => v.id === villain.id);
      this.villains[index] = villain;
    } catch (e) {
      this.error = `${e.response.status} error`;
    }
  };

  deleteVillain = async (id: string) => {
    try {
      await removeVillain(id);
      const index = this.villains.findIndex(v => v.id === id);
      this.villains.splice(index, 1);
    } catch (e) {
      this.error = `${e.response.status} error`;
    }
  };
}

decorate(VillainStore, {
  villains: observable,
  villain: observable,
  error: observable,
  fetching: observable,
  loadVillains: action,
  loadVillain: action,
  postVillain: action,
  putVillain: action,
  deleteVillain: action
});

const villainStore = new VillainStore();
export default villainStore;
