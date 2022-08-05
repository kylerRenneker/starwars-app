import * as React from "react";
import { StarWarsContext } from "../contexts/StarWars.context";
import { IPlanets } from "../interfaces";
import "./ContentPane.scss";

export const ContentPane = () => {
  const [search, setSearch] = React.useState<string | null>(null);
  const [planets, setPlanets] = React.useState<IPlanets>({});
  const context: any = React.useContext(StarWarsContext);
  const {
    peopleDictionary,
    planetDictionary,
    nextPage,
    getPeopleByPlanetName,
    filteredPlanets,
    loading,
    errorMessage,
  } = context;

  /**
   * When we search/filter we are going to send back a filtered list of planets. The filtered
   * list should take precedence if it has data.
   */
  React.useEffect(() => {
    if (Object.keys(filteredPlanets).length === 0 && search) {
      setPlanets({});
    } else if (Object.keys(filteredPlanets).length) {
      setPlanets(filteredPlanets);
    } else if (Object.keys(planetDictionary).length) {
      setPlanets(planetDictionary);
    }
  }, [planetDictionary, filteredPlanets]);

  /**
   * What one second after the user stops typing before performing the search/filter
   */
  let timer: any;
  React.useEffect(() => {
    // Prevent calling getPeopleByPlanetName on initial load
    if (search !== null) {
      timer = setTimeout(() => {
        getPeopleByPlanetName(search);
      }, 1000);
    }
  }, [search]);

  /**
   * Load more event that performs the pagination and gets the next batch of
   * people and associated planet data
   */
  const handleLoadmore = () => {
    context.getPeopleAndPlanets(nextPage);
  };

  /**
   * Event trigger on input change
   */
  const filterByPlanet = (e: any) => {
    setSearch(e.target.value);
    clearTimeout(timer);
  };

  return (
    <div className="content-pane">
      {errorMessage && (
        <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
      )}
      <div className="search-and-filter">
        {/* 
          A future enhancement could include creating a custom lazy load select field just in case the user
          doesn't know the name of the planet they want to search for.
        */}
        <form>
          <label htmlFor="planet-filter">Filter: </label>
          <input
            id="planet-filter"
            name="planetFilter"
            type="text"
            onChange={filterByPlanet}
            value={search || ""}
            placeholder="Search to filter by planet"
          />
        </form>
      </div>
      <div className="content-container">
        {loading && <p className="loader">Loading...</p>}
        <div>
          <ul className="people-list">
            {/* 
              Here we loop through the peopleDictionary, maping our homeworls with the data
              stored in out planet dictionary
            */}
            {Object.keys(peopleDictionary).map(
              (person: string, index: number) => {
                if (planets[peopleDictionary[person]?.homeworld]?.name) {
                  return (
                    <li key={index}>
                      <p className="name">
                        <strong>Name: </strong>
                        {peopleDictionary[person]?.name || ""}
                      </p>
                      <p className="home-planet">
                        <strong>Home World: </strong>
                        {planets[peopleDictionary[person]?.homeworld]?.name}
                      </p>
                    </li>
                  );
                }
              }
            )}
          </ul>
          {nextPage && !search && (
            <button
              className="load-more"
              onClick={handleLoadmore}
              disabled={loading}
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
