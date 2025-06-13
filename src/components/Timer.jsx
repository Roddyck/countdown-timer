import { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function Timer() {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const totalSecondsRef = useRef(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        const savedTimer = sessionStorage.getItem("countdownTimer");
        if (savedTimer) {
            const { totalSeconds, isActive: savedIsActive, isPaused: savedIsPaused } = JSON.parse(savedTimer);
            totalSecondsRef.current = totalSeconds;
            setIsActive(savedIsActive);
            setIsPaused(savedIsPaused);

            if (savedIsActive && !savedIsPaused) {
                startTimer()
            } else {
                updateDisplay(totalSeconds);
            }
        }
    }, []);

    useEffect(() => {
        const timerData = {
            totalSeconds: totalSecondsRef.current,
            isActive,
            isPaused
        }

        sessionStorage.setItem("countdownTimer", JSON.stringify(timerData))
    }, [isActive, isPaused, totalSecondsRef.current]);

    const updateDisplay = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;

        setMinutes(mins);
        setSeconds(secs);
    };

    const showExpirationAlert = () => {
        toast.success('TIME IS UP!', {
            duration: 5000,
            position: 'top-center',
            icon: '⏰',
            style: {
                fontSize: '2.5rem',
                padding: '2rem 3rem',
                background: '#10b981',
                color: '#ffffff',
                borderRadius: '1rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            },
        })
    };

    return (
        <div className="in-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 w-full">
            <Toaster />
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-12 w-full max-w-4xl border-2 border-gray-700">
                <h1 className="text-5xl font-bold text-center text-indigo-400 mb-12">Countdown Timer</h1>

                <div className="flex justify-center items-center mb-16">
                    <div className="flex flex-col items-center mx-4">
                        <input
                            type="number"
                            min="0"
                            value={minutes.toString().padStart(2, "0")}
                            onChange={(e) => handleInputChange(e, "minutes")}
                            disabled={isActive && !isPaused}
                            className="text-8xl font-mono text-center w-40 bg-gray-700 text-white rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-indigo-500 disabled:opacity-75"
                        />
                        <span className="text-2xl text-gray-400 mt-4">Minutes</span>
                    </div>
                    <span className="text-8xl font-bold mx-4 text-gray-400">:</span>
                    <div className="flex flex-col items-center mx-4">
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={seconds.toString().padStart(2, '0')}
                            onChange={(e) => handleInputChange(e, 'seconds')}
                            disabled={isActive && !isPaused}
                            className="text-8xl font-mono text-center w-40 bg-gray-700 text-white rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-indigo-500 disabled:opacity-75"
                        />
                        <span className="text-2xl text-gray-400 mt-4">SECONDS</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
