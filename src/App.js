import { useEffect, useState } from "react";
const KEY = "4523fcc44f5241d7bf30a2b325e8009c";

export default function App() {
  const [query, setQuery] = useState("");
  const [gamesList, setGamesList] = useState([]);
  const [selectedID, setSelectedID] = useState(null);
  function handleSelectGame(id) {
    setSelectedID((selectedID) => (id === selectedID ? null : id));
  }

  useEffect(
    function () {
      async function gamesLib() {
        const res = await fetch(
          `https://api.rawg.io/api/games?key=${KEY}&search=${query}`
        );
        const data = await res.json();
        setGamesList(data.results);
        // console.log(data.results);
      }
      gamesLib();

      // console.log(image.map);
    },
    [query]
  );

  return (
    <div className="app-body">
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery}></Search>
        <NumResults gamesList={gamesList} />
      </NavBar>
      <Main>
        <SearchGameList gamesList={gamesList} onSelectGame={handleSelectGame} />
        {selectedID ? (
          <>
            <Box gamesList={gamesList} selectedID={selectedID}></Box>
          </>
        ) : (
          ""
        )}
      </Main>
      <Footer />
    </div>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      GameL
      <span>
        <i className="fa-solid fa-infinity"></i>
      </span>
      k
    </div>
  );
}
function Search({ query, setQuery }) {
  return (
    <div className="search-bar">
      <i className="fa-solid fa-magnifying-glass icon-search"></i>
      <input
        className="search"
        type="text"
        placeholder="Search games..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}></input>
    </div>
  );
}
function NumResults({ gamesList }) {
  return (
    <div>
      {gamesList.length > 0 ? (
        <p className="num-results">{gamesList.length} results found</p>
      ) : (
        ""
      )}
    </div>
  );
}
function Main({ children }) {
  return <div className="main-page">{children}</div>;
}
function SearchGameList({ gamesList, onSelectGame }) {
  return (
    <ul className="list main-aside">
      {gamesList?.map((game) => (
        <Game game={game} onSelectGame={onSelectGame} key={game.id} />
      ))}
    </ul>
  );
}
function Game({ game, onSelectGame }) {
  return (
    <li onClick={() => onSelectGame(game.id)} className="cover list-el">
      {
        <img
          className="cover-img"
          src={game.background_image}
          alt={game.name}
        />
      }
      <div className="list-container">
        <h3 className="primary-h3">{game.name}</h3>
        <p className="secondary-p">{game.released}</p>
        <p className="secondary-p genre">
          {game.genres?.map((genre) => genre.name + "/")}
        </p>
      </div>
    </li>
  );
}
function Box({ selectedID, gamesList }) {
  const [games, setGames] = useState([]);

  useEffect(
    function () {
      async function getGameDetails() {
        const res = await fetch(
          `https://api.rawg.io/api/games/${selectedID}?key=${KEY}`
        );
        const data = await res.json();
        setGames(data);
        console.log(data);
      }
      getGameDetails();
    },
    [selectedID]
  );

  return (
    <div className="main-box">
      <Games>
        <GameInfo>
          <GameHeader>
            <Image games={games} />
            <GameDetails games={games} />
          </GameHeader>
          <GameDesc games={games} />
        </GameInfo>
      </Games>
      <GameTags games={games} />
    </div>
  );
}

function Games({ children }) {
  return <div className="box-games">{children}</div>;
}

function GameInfo({ children }) {
  return <div className="game-info">{children}</div>;
}
function GameHeader({ children }) {
  return <div className="game-header">{children}</div>;
}
function Image({ games }) {
  return (
    <div className="game-image">
      <img
        className="game-img"
        src={games.background_image}
        alt={games.name}></img>
    </div>
  );
}
function GameDetails({ games }) {
  return (
    <div className="game-details">
      <div className="details-container-one">
        <h1 className="game-title">{games.name}</h1>
        <h3 className="game-devs">
          {games.developers?.map((studio) => studio.name + " ")}
        </h3>
        <p className="game-rating">⭐{games.rating}</p>
      </div>
      <div className="details-container-two">
        <p className="game-release">Released day: {games.released}</p>
        <p className="game-platforms">
          {games.platforms?.map((platforms) => (
            <span className="game-platform">{platforms.platform.name} </span>
          ))}
        </p>
      </div>
    </div>
  );
}
function GameDesc({ games }) {
  return (
    <>
      <div className="game-description">
        <img
          className="additional-img"
          src={games.background_image_additional}
          alt={games.name}></img>
        <h3 className="about primary-h3">About game:</h3>
        <p className="primary-p">
          <TextExpander>{games.description_raw}</TextExpander>
        </p>
        <div className="images-description"></div>
      </div>
    </>
  );
}
function TextExpander({
  collapseButtonText = "Show less ◀",
  expandButtonText = "Read more ▶",
  collapsedNumWords = 100,
  children,
  expanded = false,
}) {
  const [wordList, setWordList] = useState(collapsedNumWords);
  const [allWords, setAllWords] = useState(expanded);

  return (
    <>
      <span>
        {allWords ? children : children?.split(" ", wordList).join(" ") + "..."}
      </span>
      <button onClick={() => setAllWords((exp) => !exp)} className="btnStyles">
        {allWords ? collapseButtonText : expandButtonText}
      </button>
    </>
  );
}
function GameTags({ games }) {
  return (
    <div className="right-panel">
      <div className="game-tag">
        <h2 className="primary-h2">Tags:</h2>
        <div className="tags">
          {games.tags?.map((tag) => (
            <Tag tag={tag} key={tag.id} />
          ))}
        </div>
      </div>
      <div className="game-req-details">
        <h2 className="primary-h2">Requirments:</h2>
        <div className="req">
          {games.platforms?.map((req) =>
            req.platform.name === "PC" ? (
              <Requirements req={req.requirements} />
            ) : (
              ""
            )
          )}
        </div>
      </div>
    </div>
  );
}
function Tag({ tag }) {
  return <p className="tag">{tag.name}</p>;
}
function Requirements({ req }) {
  return (
    <>
      {Object.keys(req).length > 0 ? (
        <>
          <p className="requirments game-req-min">{req.minimum}</p>
          <p className="requirments game-req-rec">{req.recommended}</p>
        </>
      ) : (
        <p className="game-req">No data</p>
      )}
    </>
  );
}

function Footer() {
  return <div className="footer">Footer</div>;
}
