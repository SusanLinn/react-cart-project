import { create } from "zustand";

import api from "../services/api";

import type {
    CartProduct,
    CartsResponse,
    Product,
} from "../types";

interface CartStore {
    cartProducts: CartProduct[];
    cartLoading: boolean;

    loadCart: () => Promise<void>;

    addToCart: (
        product: Product,
        quantity?: number
    ) => void;

    updateQuantity: (
        productId: number,
        quantity: number
    ) => void;

    removeFromCart: (
        productId: number
    ) => void;

    clearCart: () => void;
}

const roundMoney = (
    value: number
) => {
    return Number(
        value.toFixed(2)
    );
};

const getCartKey = (
    userId: string
) => {
    return `cart-user-${userId}`;
};

const saveCartToLocalStorage = (
    cartProducts: CartProduct[]
) => {
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
};

const createCartProduct = (
    product: Product,
    quantity: number
): CartProduct => {
    const total =
        product.price * quantity;

    const discountedTotal =
        total *
        (1 -
            product.discountPercentage /
                100);

    return {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity,
        total: roundMoney(total),
        discountPercentage:
            product.discountPercentage,
        discountedTotal:
            roundMoney(
                discountedTotal
            ),
        thumbnail: product.thumbnail,
    };
};

export const useCartStore =
    create<CartStore>(
        (set) => ({
            cartProducts: [],
            cartLoading: true,

            loadCart: async () => {
                set({
                    cartLoading: true,
                });

                const userId =
                    localStorage.getItem(
                        "userId"
                    );

                if (!userId) {
                    set({
                        cartProducts: [],
                        cartLoading: false,
                    });

                    return;
                }

                const cartKey =
                    getCartKey(userId);

                const savedCart =
                    localStorage.getItem(
                        cartKey
                    );

                if (
                    savedCart !== null
                ) {
                    try {
                        const cartProducts:
                            CartProduct[] =
                            JSON.parse(
                                savedCart
                            );

                        set({
                            cartProducts,
                            cartLoading:
                                false,
                        });

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

                    const cartProducts =
                        firstCart?.products ??
                        [];

                    set({
                        cartProducts,
                    });

                    localStorage.setItem(
                        cartKey,
                        JSON.stringify(
                            cartProducts
                        )
                    );
                } catch (error) {
                    console.error(
                        "Failed to load cart:",
                        error
                    );

                    set({
                        cartProducts: [],
                    });
                } finally {
                    set({
                        cartLoading: false,
                    });
                }
            },

            addToCart: (
                product,
                quantity = 1
            ) => {
                set((state) => {
                    const existingProduct =
                        state.cartProducts.find(
                            (
                                cartProduct
                            ) =>
                                cartProduct.id ===
                                product.id
                        );

                    let newCartProducts:
                        CartProduct[];

                    if (
                        existingProduct
                    ) {
                        newCartProducts =
                            state.cartProducts.map(
                                (
                                    cartProduct
                                ) => {
                                    if (
                                        cartProduct.id !==
                                        product.id
                                    ) {
                                        return cartProduct;
                                    }

                                    const newQuantity =
                                        cartProduct.quantity +
                                        quantity;

                                    const total =
                                        cartProduct.price *
                                        newQuantity;

                                    const discountedTotal =
                                        total *
                                        (1 -
                                            cartProduct.discountPercentage /
                                                100);

                                    return {
                                        ...cartProduct,
                                        quantity:
                                            newQuantity,
                                        total: roundMoney(
                                            total
                                        ),
                                        discountedTotal:
                                            roundMoney(
                                                discountedTotal
                                            ),
                                    };
                                }
                            );
                    } else {
                        newCartProducts = [
                            ...state.cartProducts,
                            createCartProduct(
                                product,
                                quantity
                            ),
                        ];
                    }

                    saveCartToLocalStorage(
                        newCartProducts
                    );

                    return {
                        cartProducts:
                            newCartProducts,
                    };
                });
            },

            updateQuantity: (
                productId,
                quantity
            ) => {
                set((state) => {
                    let newCartProducts:
                        CartProduct[];

                    if (quantity <= 0) {
                        newCartProducts =
                            state.cartProducts.filter(
                                (
                                    product
                                ) =>
                                    product.id !==
                                    productId
                            );
                    } else {
                        newCartProducts =
                            state.cartProducts.map(
                                (
                                    product
                                ) => {
                                    if (
                                        product.id !==
                                        productId
                                    ) {
                                        return product;
                                    }

                                    const total =
                                        product.price *
                                        quantity;

                                    const discountedTotal =
                                        total *
                                        (1 -
                                            product.discountPercentage /
                                                100);

                                    return {
                                        ...product,
                                        quantity,
                                        total: roundMoney(
                                            total
                                        ),
                                        discountedTotal:
                                            roundMoney(
                                                discountedTotal
                                            ),
                                    };
                                }
                            );
                    }

                    saveCartToLocalStorage(
                        newCartProducts
                    );

                    return {
                        cartProducts:
                            newCartProducts,
                    };
                });
            },

            removeFromCart: (
                productId
            ) => {
                set((state) => {
                    const newCartProducts =
                        state.cartProducts.filter(
                            (product) =>
                                product.id !==
                                productId
                        );

                    saveCartToLocalStorage(
                        newCartProducts
                    );

                    return {
                        cartProducts:
                            newCartProducts,
                    };
                });
            },

            clearCart: () => {
                const newCartProducts:
                    CartProduct[] = [];

                saveCartToLocalStorage(
                    newCartProducts
                );

                set({
                    cartProducts:
                        newCartProducts,
                });
            },
        })
    );