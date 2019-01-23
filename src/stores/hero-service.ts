import { BaseUrl } from "../utils/constants";
import { Hero } from "../models/hero";
import http from "./http-service";

export async function getHeroes(): Promise<any> {
  return await http.get(BaseUrl.heroes);
}

export async function getHero(id: string): Promise<any> {
  return await http.get(`${BaseUrl.heroes}${id}`);
}

export async function addHero(hero: Hero): Promise<any> {
  return await http.post(BaseUrl.heroes, hero);
}

export async function updateHero(hero: Hero): Promise<any> {
  return await http.put(`${BaseUrl.heroes}${hero.id}`, hero);
}

export async function removeHero(id: string): Promise<any> {
  return await http.delete(`${BaseUrl.heroes}${id}`);
}
