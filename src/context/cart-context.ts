import { createContext } from "react";

import type {
    CartProduct,
    Product,
} from "../types";

export interface CartContextValue {
    cartProducts: CartProduct[];
    totalProducts: number;
    totalQuantity: number;
    subtotal: number;
    discountedTotal: number;
    cartLoading: boolean;

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

export const CartContext =
    createContext<
        CartContextValue | undefined
    >(undefined);