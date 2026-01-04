
import React from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const EpisodeCard = ({ episodeNumber, title, image, duration, date, animeId }) => {
    return (
        <Link to={`/watch/${animeId}/${episodeNumber}`} className="group cursor-pointer">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url("${image}")` }}
                ></div>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="size-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm text-primary">
                        <Play className="fill-current ml-1 size-5" />
                    </div>
                </div>
                {duration && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">{duration}</span>
                )}
            </div>
            <h4 className="text-[#120e1b] dark:text-gray-200 font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                Ep {episodeNumber}: {title}
            </h4>
            <p className="text-gray-500 text-xs">{date}</p>
        </Link>
    );
};

export default EpisodeCard;
