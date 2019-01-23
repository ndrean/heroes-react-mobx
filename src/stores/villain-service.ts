import { BaseUrl } from "../utils/constants";
import http from "./http-service";
import { Villain } from "../models/villain";

export async function getVillains(): Promise<any> {
  return await http.get(BaseUrl.villains);
}

export async function getVillain(id: string): Promise<any> {
  return await http.get(`${BaseUrl.villains}${id}`);
}

export async function addVillain(villain: Villain): Promise<any> {
  return await http.post(BaseUrl.villains, villain);
}

export async function updateVillain(villain: Villain): Promise<any> {
  return await http.put(`${BaseUrl.villains}${villain.id}`, villain);
}

export async function removeVillain(id: string): Promise<any> {
  return await http.delete(`${BaseUrl.villains}${id}`);
}
