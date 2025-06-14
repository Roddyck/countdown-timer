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
        try {
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
        } catch (err) {
            console.error("Failed to load timer: ", err);
            sessionStorage.removeItem("countdownTimer");
        }
    }, []);

    useEffect(() => {
        try {
            const timerData = {
                totalSeconds: totalSecondsRef.current,
                isActive,
                isPaused
            };

            sessionStorage.setItem("countdownTimer", JSON.stringify(timerData));
        } catch (err) {
            console.error("Failed to save timer: ", err);
        }
    }, [isActive, isPaused, totalSecondsRef.current]);

    /**
     * @param {number} totalSeconds
     */
    const updateDisplay = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;

        setMinutes(mins);
        setSeconds(secs);
    };

    const startTimer = () => {
        if (totalSecondsRef.current <= 0) return;

        setIsActive(true);
        setIsPaused(false);

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            totalSecondsRef.current -= 1;
            updateDisplay(totalSecondsRef.current);

            if (totalSecondsRef.current <= 0) {
                clearInterval(intervalRef.current);
                setIsActive(false);
                showExpirationAlert()
            }
        }, 1000);
    }

    const togglePause = () => {
        if (!isActive) return;

        if (isPaused) {
            startTimer();
        } else {
            clearInterval(intervalRef.current);
            setIsPaused(true);
        }
    };

    const resetTimer = () => {
        clearInterval(intervalRef.current);
        totalSecondsRef.current = 0;
        updateDisplay(0);
        setIsActive(false);
        setIsPaused(false);
        sessionStorage.removeItem("countdownTimer");
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

    /**
     * @param {Object} e
     * @param {string} unit
     */
    const handleInputChange = (e, unit) => {
        const value = parseInt(e.target.value) || 0;
        let totalSeconds = 0;

        if (unit === "minutes") {
            totalSeconds = value * 60 + seconds
        } else {
            totalSeconds = minutes * 60 + value
        }

        totalSecondsRef.current = totalSeconds;
        updateDisplay(totalSeconds)
    };

    return (
        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center p-4">
            <Toaster />
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-12 w-full max-w-4xl border-2 border-gray-700">
                <h1 className="text-5xl font-bold text-center text-indigo-400 mb-12">Countdown Timer</h1>

                <div className="flex justify-center items-center mb-16">
                    <div className="flex flex-col items-center mx-4">
                        <input
                            type="number"
                            min="0"
                            max="99"
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

                <div className="flex justify-center space-x-8">
                    {!isActive ? (
                        <button
                            onClick={startTimer}
                            disabled={totalSecondsRef.current <= 0}
                            className="px-10 py-5 bg-indigo-600 text-white rounded-xl font-bold text-2xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-4 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                        >
                            START
                        </button>
                    ) : (
                        <button
                            onClick={togglePause}
                            className="px-10 py-5 bg-amber-500 text-white rounded-xl font-bold text-2xl hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-offset-4 focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105"
                        >
                            {isPaused ? "RESUME" : "PAUSE"}
                        </button>
                    )}
                
                    <button
                        onClick={resetTimer}
                        className="px-10 py-5 bg-gray-700 text-gray-200 rounded-xl font-bold text-2xl hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-offset-4 focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105"
                    >
                        RESET
                    </button>
                </div>
            </div>
        </div>
    )
}
