
import React from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnimeCard = ({ title, episode, image, rating, id }) => {
    return (
        <Link to={`/anime/${id}`} className="group cursor-pointer block">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 shadow-md bg-gray-200">
                {episode && (
                    <span className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md z-20">
                        {episode}
                    </span>
                )}
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none"></div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                    {/* Hover overlay if needed, but existing button is fine */}
                </div>

                <button className="absolute bottom-2 right-2 size-8 bg-white text-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-lg z-30">
                    <Play className="fill-current size-4 ml-0.5" />
                </button>
            </div>
            <h4 className="font-bold text-[#120e1b] truncate group-hover:text-primary transition-colors text-sm">{title}</h4>
            <p className="text-[11px] text-gray-500">{rating}</p>
        </Link>
    );
};

export default AnimeCard;
