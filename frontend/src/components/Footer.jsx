
import React from 'react';
import { Play } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full bg-white dark:bg-[#0f0b15] pt-12 pb-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800 mt-12">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                <Play className="fill-current text-white size-5" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-[#120e1b] dark:text-white font-heading">SenpaiStream</h2>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Nonton anime subtitle Indonesia terbaik dan terlengkap dengan kualitas HD, tanpa iklan yang mengganggu.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">Twitter</a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">Instagram</a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">Discord</a>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-[#120e1b]">Jelajahi</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-primary transition-colors">Anime Musim Ini</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Jadwal Rilis</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Genre Pilihan</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Anime Movie</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-[#120e1b]">Bantuan</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Request Anime</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Lapor Link Rusak</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Hubungi Kami</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-[#120e1b]">Legal</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Copyright</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>© 2023 SenpaiStream. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <span>Made with <span className="text-red-400">❤</span> for wibu</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
