export interface IPerson {
  name: string;
  homeworld: string;
  [x: string]: any;
}

export interface IPeople {
  [x: string]: IPerson;
}
