export interface IPerson {
  name: string;
  homeworld: string;
  [x: string]: any;
}

export interface IPeople {
  [x: string]: IPerson;
}

export interface IPlanet {
  name: string;
  residents: IPeople;
}

export interface IPlanets {
  [x: string]: IPlanet;
}
