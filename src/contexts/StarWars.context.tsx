import axios, { AxiosResponse } from "axios";
import * as React from "react";
import { IPeople, IPerson } from "../interfaces";

export const StarWarsContext = React.createContext(null);

const baseUrl = "https://swapi.dev/api/";

export const StarWarsProvider = (props: any) => {
  const [loading, setLoading] = React.useState(true);
  const [peopleDictionary, setPeopleDictionary] = React.useState<any>({});
  const [planetDictionary, setPlanetDictionary] = React.useState<any>({});
  const [nextPage, setNextPage] = React.useState<string | null>(null);
  //   const [error, setError] = React.useState<number | null>(null)

  const getPeopleAndPlanets = async (loadMore?: boolean) => {
    try {
      const peopleLookup: IPeople = {};
      const planetLookup: any = {};
      const response: AxiosResponse = await axios({
        url: `${loadMore && nextPage ? nextPage : `${baseUrl}people`}`,
      });
      if (response.data?.results) {
        await Promise.all(
          response.data?.results.map(async (person: IPerson) => {
            peopleLookup[person.url] = {
              name: person.name,
              homeworld: person.homeworld,
            };
            if (!planetDictionary[person.homeworld]) {
              const planetResponse: AxiosResponse = await axios({
                url: person.homeworld,
              });
              if (planetResponse.data) {
                planetLookup[planetResponse.data.url] = {
                  name: planetResponse.data.name,
                  residents: planetResponse.data.residents,
                };
              }
            }
          })
        );
        if (response.data.next) {
          setNextPage(response.data.next);
        }
        setPeopleDictionary({ ...peopleDictionary, ...peopleLookup });
        setPlanetDictionary({ ...planetDictionary, ...planetLookup });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <StarWarsContext.Provider
      value={
        {
          getPeopleAndPlanets,
          planetDictionary,
          peopleDictionary,
          nextPage,
          loading,
        } as any
      }
    >
      {props.children}
    </StarWarsContext.Provider>
  );
};
