import "./App.css";
import { ContentPane } from "./components/ContentPane";
import { StarWarsProvider } from "./contexts/StarWars.context";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Star Wars App</h1>
        <p>I know, real original naming</p>
      </header>
      <main className="main-container">
        <StarWarsProvider>
          <ContentPane />
        </StarWarsProvider>
      </main>
    </div>
  );
}

export default App;
