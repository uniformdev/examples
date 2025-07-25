import { UniformComposition } from "@uniformdev/canvas-react";
import { useEffect, useState } from "react";

const Cart = () => {
    const [composition, setComposition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/recommendations')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setComposition(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading cart recommendations...</div>;
    }

    if (error) {
        return <div>Error loading recommendations: {error}</div>;
    }

    if (!composition) {
        return <div>No recommendations available</div>;
    }

    // we return a pre-assembled composition and simply render it
    return <UniformComposition data={composition} />
}

export default Cart;