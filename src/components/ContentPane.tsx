import * as React from "react";
import { StarWarsContext } from "../contexts/StarWars.context";
import "./ContentPane.scss";

export const ContentPane = () => {
  const [search, setSearch] = React.useState<string>("");
  const [planets, setPlanets] = React.useState<any>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const context: any = React.useContext(StarWarsContext);
  const {
    peopleDictionary,
    planetDictionary,
    nextPage,
    getPeopleByPlanetName,
    filteredPlanets,
  } = context;

  React.useEffect(() => {
    setLoading(true);
    context.getPeopleAndPlanets();
  }, []);

  React.useEffect(() => {
    if (Object.keys(filteredPlanets).length) {
      setPlanets(filteredPlanets);
      setLoading(false);
    } else if (Object.keys(planetDictionary).length) {
      setPlanets(planetDictionary);
      setLoading(false);
    }
  }, [planetDictionary, filteredPlanets]);

  let timer: any;
  React.useEffect(() => {
    timer = setTimeout(() => {
      setLoading(true);
      getPeopleByPlanetName(search);
    }, 1000);
  }, [search]);

  const handleLoadmore = () => {
    setLoading(true);
    context.getPeopleAndPlanets(nextPage);
  };

  const filterByPlanet = (e: any) => {
    setSearch(e.target.value);
    clearTimeout(timer);
  };

  return (
    <div className="content-pane">
      <div className="search-and-filter">
        <input
          type="text"
          onChange={filterByPlanet}
          value={search}
          placeholder="Search to filter by planet"
        />
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
