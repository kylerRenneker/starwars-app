import "./App.scss";
import { ContentPane } from "./components/ContentPane";
import { StarWarsProvider } from "./contexts/StarWars.context";

function App() {
  return (
    <div className="app">
      <div className="overlay"></div>
      <header className="app-header">
        <h1>
          Star Wars App: <strong>The Most Orignal Name Ever</strong>
        </h1>
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
