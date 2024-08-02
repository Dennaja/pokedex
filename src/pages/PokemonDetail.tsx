import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import arrow from '../assets/arrow.svg'
import arro from '../assets/arro.svg'
import arr from '../assets/arr.svg'

interface PokemonDetail {
    name: string;
    id: number;
    height: number;
    weight: number;
    types: Array<{ type: { name: string } }>;
    abilities: Array<{ ability: { name: string } }>;
    sprites: {
        front_default: string;
    };
    stats: Array<{ base_stat: number, stat: { name: string } }>;
}

const PokemonDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
    const [backgroundColor, setBackgroundColor] = useState<string>('bg-gray-200'); // Default color
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await axios.get<PokemonDetail>(`https://pokeapi.co/api/v2/pokemon/${id}`);
                setPokemon(response.data);
                
                // Get the first type as an example
                const type = response.data.types[0].type.name;
                setBackgroundColor(getBackgroundColor(type));
            } catch (error) {
                console.error('Error fetching the Pokémon details', error);
            }
        };

        fetchPokemon();
    }, [id]);

    const getBackgroundColor = (type: string): string => {
        const colors: { [key: string]: string } = {
            normal: 'bg-normal',
            fire: 'bg-fire',
            water: 'bg-water',
            electric: 'bg-electric',
            grass: 'bg-grass',
            ice: 'bg-ice',
            fighting: 'bg-fighting',
            poison: 'bg-poison',
            ground: 'bg-ground',
            flying: 'bg-flying',
            psychic: 'bg-psychic',
            bug: 'bg-bug',
            rock: 'bg-rock',
            ghost: 'bg-ghost',
            dragon: 'bg-dragon',
            drak: 'bg-drak',
            steel: 'bg-steel',
            fairy: 'bgfairy',
            
            // Add more types and their corresponding colors here
        };
        return colors[type] || 'bg-gray-200'; // Default color
    };

    const handleNextPokemon = () => {
        const nextId = Number(id) + 1;
        navigate(`/pokemon/${nextId}`);
    };

    const handlePreviousPokemon = () => {
        const prevId = Number(id) - 1;
        navigate(`/pokemon/${prevId}`);
    };

    if (!pokemon) return <div>Loading...</div>;

    return (
        <div className={`container mx-auto p-4 ${backgroundColor} text-white`}>
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="text-white text-xl font-bold">
                    <img src={arro}/> {/* Back arrow */}
                </Link>
                <h1 className="text-3xl font-bold">{pokemon.name.toUpperCase()}</h1>
                <p className="text-2xl">#{pokemon.id.toString().padStart(3, '0')}</p>
            </div>
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePreviousPokemon} className="text-white text-2xl">
                    <img src={arr}/> {/* Left arrow */}
                </button>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} className="mb-4 mx-auto size-60" />
                <button onClick={handleNextPokemon} className="text-white text-2xl">
                    <img src={arrow} /> {/* Right arrow */}
                </button>
            </div>
            <div className="flex justify-center space-x-4 mb-4">
                {pokemon.types.map(type => (
                    <span key={type.type.name} className="bg-white text-green-500 px-2 py-1 rounded-full">{type.type.name.toUpperCase()}</span>
                ))}
            </div>
            <div className="bg-white text-black p-4 rounded-lg mb-4">
                <div className="flex justify-between">
                    <p><strong>Weight:</strong> {pokemon.weight / 10} kg</p>
                    <p><strong>Height:</strong> {pokemon.height / 10} m</p>
                </div>
                <p><strong>Abilities:</strong> {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
            </div>
            <div className="bg-white text-black p-4 rounded-lg mb-4">
                <h2 className="text-xl font-bold mb-2">Base Stats</h2>
                {pokemon.stats.map(stat => (
                    <div key={stat.stat.name} className="mb-2">
                        <div className="flex justify-between">
                            <span>{stat.stat.name.toUpperCase()}</span>
                            <span>{stat.base_stat}</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${Math.min(stat.base_stat, 200) / 200 * 100}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PokemonDetail;
