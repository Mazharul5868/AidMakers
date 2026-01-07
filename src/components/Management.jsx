import { useEffect, useState } from "react";
const Management = () => { 

    const [scores, setScores] = useState([]);
    const [loadingScores, setLoadingScores] = useState(true);
    const [scoresError, setScoresError] = useState("");

    useEffect(() => {
    async function loadScores() {
        try {
        const res = await fetch("https://aidmakers.onrender.com/api/scoring");
        if (!res.ok) throw new Error("Failed to fetch scores");

        const data = await res.json();

        // e.g. sort by score desc, take top 10
        const sorted = [...data].sort(
            (a, b) => b.total_score - a.total_score
        );
        setScores(sorted.slice(0, 10));
        } catch (err) {
        setScoresError(err.message);
        } finally {
        setLoadingScores(false);
        }
    }

    loadScores();
    }, []);


    return(
         <section className="card card-full">
            <h2 className="card-title">User Score Overview</h2>
            <div className="card-content">
                {loadingScores && <p>Loading scores...</p>}
                {scoresError && <p style={{ color: "red" }}>Error: {scoresError}</p>}

                {!loadingScores && !scoresError && scores.length > 0 && (
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={scores}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                        dataKey="user_id" // or "name" if you expose it
                        label={{ value: "User", position: "insideBottom", offset: -5 }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                        dataKey="total_score"
                        name="Score"
                        fill="var(--chart-line-total)"
                        />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                )}

                {!loadingScores && !scoresError && scores.length === 0 && (
                <p>No scoring data available.</p>
                )}
            </div>
            </section>

    )
};

export default Management;