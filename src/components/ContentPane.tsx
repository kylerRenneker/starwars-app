import * as React from "react";
import { StarWarsContext } from "../contexts/StarWars.context";
import { IPerson } from "../interfaces";

export const ContentPane = () => {
  const context: any = React.useContext(StarWarsContext);
  const { peopleDictionary, planetDictionary, loading, nextPage } = context;

  React.useEffect(() => {
    context.getPeopleAndPlanets();
  }, []);

  const handleLoadmore = () => {
    context.getPeopleAndPlanets(nextPage);
  };

  return (
    <div className="contentPane">
      <div className="search-and-filter"></div>
      <div className="content-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <ul>
              {Object.keys(peopleDictionary).map(
                (person: string, index: number) => {
                  return (
                    <li key={index}>
                      {peopleDictionary[person]?.name || ""}
                      <p>
                        {planetDictionary[peopleDictionary[person]?.homeworld]
                          ?.name || ""}
                      </p>
                    </li>
                  );
                }
              )}
            </ul>
            {nextPage && <button onClick={handleLoadmore}>Load More</button>}
          </div>
        )}
      </div>
    </div>
  );
};
