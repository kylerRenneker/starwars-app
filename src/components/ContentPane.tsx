import * as React from "react";
import { StarWarsContext } from "../contexts/StarWars.context";
import { IPerson } from "../interfaces";

export const ContentPane = () => {
  const context: any = React.useContext(StarWarsContext);
  const { peopleDictionary, planetDictionary, loading } = context;

  React.useEffect(() => {
    context.getPeopleAndPlanets();
  }, []);

  return (
    <div className="contentPane">
      <div className="search-and-filter"></div>
      <div className="content-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {Object.keys(peopleDictionary).map((person: string) => {
              return (
                <li>
                  {peopleDictionary[person].name}
                  <p>
                    {planetDictionary[peopleDictionary[person].homeworld].name}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
