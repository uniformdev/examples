import { UniformComposition } from "@uniformdev/canvas-react";
import { useEffect, useState } from "react";

const Cart = () => {
    const [composition, setComposition] = useState({});
    useEffect(() => {
        fetch('/api/recommendations').then(res => res.json()).then(data => {
            setComposition(data);
        });
    }, []);

    // we return a pre-assembled composition and simply render it
    return <UniformComposition data={composition} />
}

export default Cart;