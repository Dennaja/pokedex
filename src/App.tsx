import React, { useState, useEffect, ChangeEvent } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import PokemonDetail from './pages/PokemonDetail';
import pokeball from '../public/pokeball.svg';

// Tipe data untuk Pokémon
interface Pokemon {
  name: string;
  id: number;
  image: string;
  url?: string; // Opsional, mungkin tidak selalu diperlukan
}

interface PokemonListResponse {
  results: { name: string; url: string }[];
}

// Komponen untuk menampilkan daftar Pokémon
const PokemonList: React.FC<{ pokemons: Pokemon[]; filter: 'name' | 'id'; searchTerm: string; onSearch: (e: ChangeEvent<HTMLInputElement>) => void; onFilter: (filter: 'name' | 'id') => void }> = ({ pokemons, filter, searchTerm, onSearch, onFilter }) => {
  const filteredPokemons = pokemons.filter(pokemon => {
    const matchesName = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesId = pokemon.id.toString().includes(searchTerm);
    return filter === 'name' ? matchesName : matchesId;
  });

  return (
    <>
      <div className="bg-red-600 min-h-screen">
        <div className="justify-start ml-6 font-Poppins items-center content-center flex text-white font-bold text-5xl">
          <img src={pokeball} className='mt-3 mr-3'/>
          <h1>Pokédex</h1>
        </div>

        {/* Search Bar di bawah */}
        <div className="p-4 flex justify-center items-center text-white">
          <input
            type="text"
            value={searchTerm}
            onChange={onSearch}
            placeholder="Search Pokémon"
            className="border rounded-full p-2 text- text-black min-w-96 mr-6 "
          />
          <ProfileDropdown onFilter={onFilter} />
        </div>
        {/* Card di bawah  */}
        <div className="grid grid-cols-3 items-baseline content-start pb-3 border rounded-lg bg-white m-5 min-h-[calc(100vh-150px)]">
          {filteredPokemons.map(pokemon => (
            <div key={pokemon.id} className="card border rounded-lg text-center mx-2 mt-4 bg-white text-black max-h-[calc(100vh-644px)]">
              <Link to={`/pokemon/${pokemon.id}`}>
                <p className="text-gray-600">#{pokemon.id}</p>
                <img src={pokemon.image} alt={pokemon.name} className=" w-32 h-32 mx-auto" />
                <h3 className="text-xl font-semibold bg-gray-200 rounded-t-md ">{pokemon.name}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// Komponen dropdown profile
const ProfileDropdown: React.FC<{ onFilter: (filter: 'name' | 'id') => void }> = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchBy, setSearchBy] = useState<'id' | 'name'>('id');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchByChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = event.target.value as 'id' | 'name';
    setSearchBy(newFilter);
    onFilter(newFilter);
  };

  const getProfileImage = () => {
    if (searchBy === 'id') {
      return 'https://via.placeholder.com/30/FFFFFF/FF0000/?text=%23';
    } else {
      return 'https://via.placeholder.com/30/FFFFFF/FF0000/?text=A';
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={toggleDropdown}
          className="inline-flex justify-center w-full rounded-full border shadow-sm p-2 bg-white focus:outline-none"
        >
          <img
            src={getProfileImage()}
            alt="Profile"
            className="rounded-full"
          />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-26 rounded-md shadow-lg bg-red-500 ring-1 ring-red-500 ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div className="px-4 py-2">
              <div className="mt-2 flex flex-col text-white">
                <label className="mb-4">Sort: by</label>
                <div className="bg-white text-black p-4 rounded-xl">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-red-500"
                      name="searchBy"
                      value="id"
                      checked={searchBy === 'id'}
                      onChange={handleSearchByChange}
                    />
                    <span className="ml-2">ID</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="searchBy"
                      value="name"
                      checked={searchBy === 'name'}
                      onChange={handleSearchByChange}
                    />
                    <span className="ml-2">Name</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Komponen utama aplikasi
const App: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<'name' | 'id'>('name');

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const limit = 100;
        const promises = [];

        for (let offset = 0; offset < limit; offset += 100) {
          promises.push(
            axios.get<PokemonListResponse>(`https://pokeapi.co/api/v2/pokemon?limit=100&offset=${offset}`)
          );
        }

        const responses = await Promise.all(promises);
        const allResults = responses.flatMap(response => response.data.results);

        const enhancedPokemons = allResults.map((pokemon, index) => {
          const id = index + 1;
          return {
            name: pokemon.name,
            url: pokemon.url,
            id,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
          };
        });

        setPokemons(enhancedPokemons);
      } catch (error) {
        console.error('Error fetching the Pokemon data', error);
      }
    };

    fetchPokemons();
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (filter: 'name' | 'id') => {
    setFilter(filter);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PokemonList
            pokemons={pokemons}
            filter={filter}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onFilter={handleFilter}
          />
        } />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
