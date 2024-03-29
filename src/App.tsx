import { useEffect, useRef, useState } from 'react';
import './styles/pokeball.css';
import pokeballImg from '/img/pokeball.png';

type Pokemon = {
  id: number;
  name: string;
  url: string;
};

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [input, setInput] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [fail, setFail] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 384)}`,
    )
      .then((response) => response.json())
      .then((data) => {
        const pokemonData = {
          id: data.id,
          name: data.name,
          url: data.sprites.other.dream_world.front_default,
        };
        if (pokemonData) {
          setPokemon(pokemonData);
          setSuccess(false);
          setInput('');
          setIsLoading(false);
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [count]);

  const handleReset = () => {
    setCount(0);
    inputRef?.current?.focus();
  };

  const handleGuess = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (pokemon && !success && !fail) {
      if (input === pokemon.name) {
        setSuccess(true);
        inputRef?.current?.focus();
        setTimeout(() => {
          setCount(count + 1);
        }, 1000);
      } else {
        setFail(true);
        setTimeout(() => {
          setFail(false);
        }, 500);
      }
    }
  };

  return (
    <div className='flex flex-col items-center max-w-sm pt-20 mx-auto overflow-hidden'>
      <h1 className='text-3xl font-bold uppercase'>Who's that pokemon?</h1>
      <p className='mt-2 text-xl'>
        {count} in a row
        {count === 0 && ' 🙁'}
        {count > 0 && count <= 2 && ' 🤔'}
        {count > 2 && count <= 4 && ' 😁'}
        {count > 4 && ' 🤯'}
      </p>
      {isLoading ? (
        <div className='flex flex-col max-w-sm mt-12 w-[250px] h-[250px] items-center justify-center'>
          <img className='pokeball' src={pokeballImg} />
        </div>
      ) : (
        <>
          {pokemon && (
            <div className='flex flex-col max-w-sm mt-12'>
              <img
                src={pokemon.url}
                alt='guess'
                className={`w-[250px] h-[250px] mix-blend-normal drop-shadow-lg ${
                  fail && 'animate-shake'
                } ${success ? 'brightness-100' : 'brightness-0'}`}
              />
            </div>
          )}
        </>
      )}
      <form onSubmit={handleGuess} className='flex flex-col gap-3'>
        <div className='flex flex-row gap-2 mt-6'>
          <input
            ref={inputRef}
            autoFocus
            id='pokeInput'
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='p-2 text-base font-normal bg-transparent border-2 border-gray-800 rounded outline-none'
          />
          <button
            onClick={handleReset}
            type='button'
            className='p-2 border-2 border-gray-800 rounded hover:bg-gray-800 hover:text-[#f5c556] transition duration-500 outline-none'
          >
            <span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'
                />
              </svg>
            </span>
          </button>
        </div>
        <button
          type='submit'
          disabled={success}
          className='disabled:cursor-pointer p-2 text-base font-normal uppercase border-2 border-gray-800 rounded hover:bg-gray-800 hover:text-[#f5c556] transition duration-500 outline-none'
        >
          Guess
        </button>
      </form>
    </div>
  );
}

export default App;
