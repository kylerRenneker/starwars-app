import axios, { AxiosResponse } from "axios";
import * as React from "react";
import { IPeople, IPerson, IPlanets } from "../interfaces";

export const StarWarsContext = React.createContext(null);

const baseUrl = "https://swapi.dev/api/";

/**
 * NOTE: For this type of app, context or any type of shared store, is not necessarily needed.
 *
 * Technically we could have put all of the state and methods at the App or ContentPane level.
 *
 * On the other hand, we are setting ourselfs up better for future iterations if we set up some sort of
 * state management solution.  - Sorry I didn't use Redux ;) -
 */

interface IProps {
  children: JSX.Element;
}

export const StarWarsProvider = (props: IProps) => {
  const [peopleDictionary, setPeopleDictionary] = React.useState<IPeople>({});
  const [filteredPlanets, setFilteredPlanets] = React.useState<IPlanets>({});
  const [planetDictionary, setPlanetDictionary] = React.useState<IPlanets>({});
  const [nextPage, setNextPage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    getPeopleAndPlanets();
  }, []);

  /**
   * This method does the magic on load & "load more".
   */
  const getPeopleAndPlanets = async (loadMore?: boolean) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const peopleLookup: IPeople = {};
      const planetLookup: any = { ...planetDictionary };
      /**
       * If this is the initial load we just query for the first page of people, otherwise
       * if loadMore is passe in we paginate to the next page.
       */
      const response: AxiosResponse = await axios({
        url: `${loadMore && nextPage ? nextPage : `${baseUrl}people`}`,
      });
      if (response.data?.results?.length) {
        /**
         * This is where we hydrate our people & planet dictionaries. Ideally, we would have better REST endpoints (or GraphQL queries)
         * that would join the people and associated planet data and return what we want.
         *
         * By using objects to store the data, we can perform lookups to determine if we need to grab the planet data or not.
         */
        const people = response.data.results;
        for (const person of people) {
          peopleLookup[person.url] = {
            name: person.name,
            homeworld: person.homeworld,
          };
          /**
           * Here we save on some network calls by only grabbing the new planet if it does not
           * exist in our planetDictionary already.
           */
          if (!planetLookup[person.homeworld]) {
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
        }

        /**
         * We need to make sure we store the next page for pagination.
         */
        if (response.data.next) {
          setNextPage(response.data.next);
        } else {
          setNextPage(null);
        }
        setPeopleDictionary({ ...peopleDictionary, ...peopleLookup });
        setPlanetDictionary({ ...planetDictionary, ...planetLookup });
      }
    } catch (e: any) {
      console.error(e);
      setErrorMessage("Oops! Someting went wrong.");
    }
    setLoading(false);
  };

  const getPeopleByPlanetName = async (planetName: string) => {
    /**
     * There are several different approaches we could take to improve the search/filtering.
     * One option is to lazy load all of the planets into memory when the app mounts, preventing
     * the need for a network request for each search.
     *
     * Another way to optimize would be to track when we have loaded all people. At that point we would not
     * need to hit the API at all, we could just filter by whats in memory.
     */
    setErrorMessage(null);
    try {
      if (planetName) {
        setLoading(true);
        const response: AxiosResponse = await axios({
          url: `https://swapi.dev/api/planets/?search=${planetName}`,
        });
        if (response.data?.results?.length) {
          const planets = response.data?.results;
          const planetLookup: IPlanets = {};
          const personLookup: IPeople = {};
          for (const planet of planets) {
            planetLookup[planet.url] = {
              name: planet.name,
              residents: planet.residents,
            };
            /**
             * Small enhancment - find the list of missing people first.
             *
             * Technically the time complexity is still 0(n) for Array.filter and we
             * are still making the same number of network request as before, but this
             * is easier to follow and understand.
             */
            const missingPeople = planet.residents.filter(
              (person: string) => !peopleDictionary[person]
            );
            for (const person of missingPeople) {
              const response: AxiosResponse = await axios({
                url: person,
              });
              if (response.data)
                personLookup[response.data.url] = {
                  name: response.data.name,
                  homeworld: response.data.homeworld,
                };
            }
          }

          if (response.data.next) {
            setNextPage(response.data.next);
          }
          setFilteredPlanets(planetLookup);
          setPeopleDictionary({ ...peopleDictionary, ...personLookup });
        } else {
          setFilteredPlanets({});
        }
        setLoading(false);
      } else {
        setFilteredPlanets({});
      }
    } catch (e: any) {
      console.error(e);
      if (e.response.status === 404) {
        setErrorMessage("Not Found");
      } else {
        setErrorMessage("Oops! Someting went wrong. Please try again later.");
      }
    }
  };

  return (
    <StarWarsContext.Provider
      value={
        {
          getPeopleAndPlanets,
          getPeopleByPlanetName,
          planetDictionary,
          filteredPlanets,
          peopleDictionary,
          nextPage,
          loading,
          errorMessage,
        } as any
      }
    >
      {props.children}
    </StarWarsContext.Provider>
  );
};
