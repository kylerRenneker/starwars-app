import * as React from "react";
import { StarWarsContext } from "../contexts/StarWars.context";

export const ContentPane = () => {
  const context: any = React.useContext(StarWarsContext);

  React.useEffect(() => {
    // context.getPeopleAndPlanets();
  }, []);

  React.useEffect(() => {
    if (context.peopleDictionary) {
      console.log("context.peopleDictionary: ", context.peopleDictionary);
    }
  }, [context.peopleDictionary]);

  return <div>ContentPane</div>;
};
