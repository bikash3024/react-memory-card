import { useEffect, useState } from "react";

const pokemonList = [
  "bulbasaur",
  "charmander",
  "squirtle",
  "pikachu",
  "meowth",
  "jigglypuff",
  "pidgey",
  "rattata",
  "abra",
  "kadabra",
];

async function fetchPokemon(
  name: string
): Promise<{ name: string; image: string | null }> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
      mode: "cors",
    });
    const content = await response.json();
    return { name: content.name, image: content.sprites.front_default };
  } catch (error) {
    console.error(`Failed to fetch ${name}:`, error);
    return { name, image: null };
  }
}

function App() {
  const [choices, setChoices] = useState<string[]>([]);
  const [highest, setHighest] = useState<number>(0);
  const [collection, setCollection] = useState<
    { name: string; image: string | null }[]
  >([]);

  useEffect(() => {
    // Initial fetch
    shuffleAndFetch();
  }, []);

  const shuffleAndFetch = () => {
    const shuffled = [...pokemonList].sort(() => Math.random() - 0.5);
    Promise.all(shuffled.map(fetchPokemon)).then(setCollection);
  };

  const handleClick = (name: string) => {
    if (!choices.includes(name)) {
      setChoices([...choices, name]);
    } else {
      if (choices.length > highest) {
        setHighest(choices.length);
      }
      setChoices([]);
    }
    shuffleAndFetch();
  };

  return (
    <div className="flex flex-col items-center gap-24">
      <h1 className="text-center mt-16 text-5xl font-bold font-retro">
        Memory Game
      </h1>
      <ul className="flex justify-center gap-10 text-center text-xl font-sans font-medium">
        <li className="border-solid border-2 border-gray-400 rounded-md px-4 py-1 w-44">
          <h2>Score</h2>
          <p className="font-digital text-2xl">{choices.length}</p>
        </li>
        <li className="border-solid border-2 border-gray-400 rounded-md px-4 py-1 w-44">
          <h2>Highest score</h2>
          <p className="font-digital text-2xl">{highest}</p>
        </li>
      </ul>

      <div className="grid grid-cols-5 w-2/4 gap-8">
        {collection.map((value) => (
          <div
            key={value.name}
            onClick={() => handleClick(value.name)}
            className="shadow w-36 h-36 flex flex-col items-center justify-center bg-violet-300 rounded-md text-slate-100"
          >
            <h1>{value.name}</h1>
            {value.image ? (
              <img src={value.image} alt={value.name} />
            ) : (
              <p>No Image</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
