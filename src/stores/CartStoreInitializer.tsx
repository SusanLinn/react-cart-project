import { useEffect } from "react";

import { useCartStore } from "./useCartStore";

const CartStoreInitializer = () => {
    const loadCart =
        useCartStore(
            (state) =>
                state.loadCart
        );

    useEffect(() => {
        const handleCartUserChanged =
            () => {
                void loadCart();
            };

        void loadCart();

        window.addEventListener(
            "cart-user-changed",
            handleCartUserChanged
        );

        return () => {
            window.removeEventListener(
                "cart-user-changed",
                handleCartUserChanged
            );
        };
    }, [loadCart]);

    return null;
};

export default CartStoreInitializer;