import {
    useEffect,
    useReducer,
    useState,
} from "react";

import type {
    ReactNode,
} from "react";

import api from "../services/api";

import {
    cartReducer,
} from "../reducers/cartReducer";

import {
    CartContext,
} from "./cart-context";

import type {
    CartsResponse,
    Product,
} from "../types";

interface CartProviderProps {
    children: ReactNode;
}

const getCartKey = (
    userId: string
) => {
    return `cart-user-${userId}`;
};

const roundMoney = (
    value: number
) => {
    return Number(
        value.toFixed(2)
    );
};

const CartProvider = ({
    children,
}: CartProviderProps) => {
    const [
        cartProducts,
        dispatch,
    ] = useReducer(
        cartReducer,
        []
    );

    const [
        cartLoading,
        setCartLoading,
    ] = useState(true);

    useEffect(() => {
        const loadCart = async () => {
            setCartLoading(true);

            const userId =
                localStorage.getItem(
                    "userId"
                );

            if (!userId) {
                dispatch({
                    type: "LOAD_CART",
                    payload: [],
                });

                setCartLoading(false);

                return;
            }

            const cartKey =
                getCartKey(userId);

            const savedCart =
                localStorage.getItem(
                    cartKey
                );

            if (savedCart !== null) {
                try {
                    dispatch({
                        type: "LOAD_CART",
                        payload:
                            JSON.parse(
                                savedCart
                            ),
                    });

                    setCartLoading(false);

                    return;
                } catch (error) {
                    console.error(
                        "Failed to parse saved cart:",
                        error
                    );

                    localStorage.removeItem(
                        cartKey
                    );
                }
            }

            try {
                const response =
                    await api.get<CartsResponse>(
                        `/users/${userId}/carts`
                    );

                const firstCart =
                    response.data
                        .carts[0];

                dispatch({
                    type: "LOAD_CART",
                    payload:
                        firstCart?.products ??
                        [],
                });
            } catch (error) {
                console.error(
                    "Failed to load cart:",
                    error
                );

                dispatch({
                    type: "LOAD_CART",
                    payload: [],
                });
            } finally {
                setCartLoading(false);
            }
        };

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
    }, []);

    useEffect(() => {
        if (cartLoading) {
            return;
        }

        const userId =
            localStorage.getItem(
                "userId"
            );

        if (!userId) {
            return;
        }

        localStorage.setItem(
            getCartKey(userId),
            JSON.stringify(
                cartProducts
            )
        );
    }, [
        cartProducts,
        cartLoading,
    ]);

    const addToCart = (
        product: Product,
        quantity = 1
    ) => {
        dispatch({
            type: "ADD_TO_CART",
            payload: {
                product,
                quantity,
            },
        });
    };

    const updateQuantity = (
        productId: number,
        quantity: number
    ) => {
        dispatch({
            type: "UPDATE_QUANTITY",
            payload: {
                productId,
                quantity,
            },
        });
    };

    const removeFromCart = (
        productId: number
    ) => {
        dispatch({
            type: "REMOVE_FROM_CART",
            payload: productId,
        });
    };

    const clearCart = () => {
        dispatch({
            type: "CLEAR_CART",
        });
    };

    const totalProducts =
        cartProducts.length;

    const totalQuantity =
        cartProducts.reduce(
            (
                total,
                product
            ) =>
                total +
                product.quantity,
            0
        );

    const subtotal =
        roundMoney(
            cartProducts.reduce(
                (
                    total,
                    product
                ) =>
                    total +
                    product.total,
                0
            )
        );

    const discountedTotal =
        roundMoney(
            cartProducts.reduce(
                (
                    total,
                    product
                ) =>
                    total +
                    product.discountedTotal,
                0
            )
        );

    return (
        <CartContext.Provider
            value={{
                cartProducts,
                totalProducts,
                totalQuantity,
                subtotal,
                discountedTotal,
                cartLoading,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;