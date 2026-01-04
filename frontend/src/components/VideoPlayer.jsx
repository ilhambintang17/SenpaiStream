
import React from 'react';
import { Play, SkipForward, Volume2, Settings, Maximize, MonitorPlay } from 'lucide-react';

const VideoPlayer = ({ poster, src }) => {
    return (
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group cursor-pointer group-hover:shadow-primary/20 transition-all">
            {/* Real Player Iframe */}
            {src ? (
                <iframe
                    src={src}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    title="Anime Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
            ) : (
                <div className="relative w-full h-full">
                    {/* Video Placeholder */}
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-80"
                        style={{ backgroundImage: `url('${poster || "https://lh3.googleusercontent.com/aida-public/AB6AXuA-HSIQls5RQEAHpxYmbXPfTEOYgiJN9D_fLZXXQERyHWmXV4ByX8khvv1YT92PkgotZ0nRMS45rw5pt2Uo8aFRw3_ud44BFK_8gXvo-6nJFjdgQWHizLwELNWZu26MprS3Uf9LDbMbRd6M6lSE2XCpypNaii2a4Ye8o2LpXYFm96p1zzebEDPQy4VAj1BH6rLS6HBBQ_8-VfrWxiPnMs2Nfxxya_EbVAmAIEtfG8lnm1Fu9v3p2zQqulEvQuKwy9mORYm6CoAJtogS"}')` }}
                    ></div>
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

                    {/* Big Play Button (Center) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                        <button className="flex items-center justify-center rounded-full size-20 bg-primary/90 text-white backdrop-blur-sm shadow-lg hover:scale-105 transition-transform">
                            <Play className="fill-current ml-1 size-10" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
