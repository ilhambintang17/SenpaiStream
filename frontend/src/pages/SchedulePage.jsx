import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SchedulePage = () => {
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await fetch('/api/otakudesu/schedule');
                const result = await response.json();

                if (result.statusCode === 200) {
                    const schedMap = {};
                    result.data.scheduleList.forEach(day => {
                        schedMap[day.title] = day.animeList;
                    });
                    setSchedule(schedMap);
                }
            } catch (error) {
                console.error("Error fetching schedule data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    if (loading) return <div className="text-center p-10 font-bold text-lg dark:text-white">Loading Schedule...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold dark:text-white">Release Schedule</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(schedule).map(day => (
                    <div key={day} className="bg-white dark:bg-[#1a1625] p-6 rounded-xl border border-gray-100 dark:border-white/5">
                        <h2 className="text-xl font-bold text-primary mb-4 capitalize">{day}</h2>
                        <ul className="space-y-3">
                            {schedule[day].map((anime, idx) => (
                                <li key={idx} className="group">
                                    <Link
                                        to={`/anime/${anime.animeId}`}
                                        className="flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-lg transition-colors block"
                                    >
                                        <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">{anime.title}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SchedulePage;
