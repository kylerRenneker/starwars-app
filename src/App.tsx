import * as React from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import "./App.css";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://swapi.dev/api/",
});

function App() {
  React.useEffect(() => {
    getPeople();
  }, []);

  const getPeople = async () => {
    try {
      const response: AxiosResponse = await axiosInstance.get("people");
      console.log(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Star Wars App</h1>
        <p>I know, real original naming</p>
      </header>
      <main className="main-container">
        <div className="filter-search-container"></div>
        <div className="results-container"></div>
      </main>
    </div>
  );
}

export default App;
