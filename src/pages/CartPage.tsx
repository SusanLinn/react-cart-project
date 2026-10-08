import {
    useEffect,
    useState,
} from "react";

import {
    ArrowLeft,
    ShoppingCart,
    Trash2,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import CartItem from "../components/CartItem";
import Navbar from "../components/Navbar";

import { Button } from "../components/ui/button";

import { useCart } from "../hooks/useCart";

import api from "../services/api";

import type { User } from "../types";

const CartPage = () => {
    const navigate = useNavigate();

    const {
        cartProducts,
        totalProducts,
        totalQuantity,
        subtotal,
        discountedTotal,
        cartLoading,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useCart();

    const [user, setUser] =
        useState<User | null>(null);

    const [userLoading, setUserLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const discountAmount =
        Number(
            (
                subtotal -
                discountedTotal
            ).toFixed(2)
        );

    useEffect(() => {
        const loadUser = async () => {
            const accessToken =
                localStorage.getItem(
                    "accessToken"
                );

            if (!accessToken) {
                navigate(
                    "/login",
                    {
                        replace: true,
                    }
                );

                return;
            }

            try {
                const response =
                    await api.get<User>(
                        "/auth/me",
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );

                setUser(response.data);
            } catch {
                setError(
                    "Failed to load user."
                );
            } finally {
                setUserLoading(false);
            }
        };

        loadUser();
    }, [navigate]);

    const handleIncrease = (
        productId: number,
        quantity: number
    ) => {
        updateQuantity(
            productId,
            quantity + 1
        );
    };

    const handleDecrease = (
        productId: number,
        quantity: number
    ) => {
        updateQuantity(
            productId,
            quantity - 1
        );
    };

    const handleRemove = (
        productId: number
    ) => {
        removeFromCart(productId);
    };

    const handleLogout = () => {
        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "userId"
        );

        navigate(
            "/login",
            {
                replace: true,
            }
        );
    };

    if (
        userLoading ||
        cartLoading
    ) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>
                    Loading cart...
                </p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-red-600">
                    {error ||
                        "Failed to load user."}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar
                user={user}
                onLogout={handleLogout}
            />

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <Link
                    to="/products"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />

                    Continue Shopping
                </Link>

                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="size-7" />

                        <h1 className="text-3xl font-bold">
                            Shopping Cart
                        </h1>
                    </div>

                    {cartProducts.length >
                        0 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                clearCart
                            }
                            className="text-red-600 hover:text-red-600"
                        >
                            <Trash2 className="size-4" />

                            Clear Cart
                        </Button>
                    )}
                </div>

                {cartProducts.length ===
                0 ? (
                    <div className="rounded-xl border py-20 text-center">
                        <ShoppingCart className="mx-auto size-12 text-muted-foreground" />

                        <h2 className="mt-4 text-xl font-semibold">
                            Your cart is empty
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Add some products to
                            your cart.
                        </p>

                        <Button
                            className="mt-6"
                            nativeButton={false}
                            render={
                                <Link to="/products" />
                            }
                        >
                            Browse Products
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                        <section className="rounded-xl border px-5">
                            {cartProducts.map(
                                (product) => (
                                    <CartItem
                                        key={
                                            product.id
                                        }
                                        product={
                                            product
                                        }
                                        onIncrease={() =>
                                            handleIncrease(
                                                product.id,
                                                product.quantity
                                            )
                                        }
                                        onDecrease={() =>
                                            handleDecrease(
                                                product.id,
                                                product.quantity
                                            )
                                        }
                                        onRemove={() =>
                                            handleRemove(
                                                product.id
                                            )
                                        }
                                    />
                                )
                            )}
                        </section>

                        <aside className="h-fit rounded-xl border p-6 lg:sticky lg:top-6">
                            <h2 className="text-xl font-semibold">
                                Order Summary
                            </h2>

                            <div className="mt-6 space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Products
                                    </span>

                                    <span>
                                        {
                                            totalProducts
                                        }
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Total Quantity
                                    </span>

                                    <span>
                                        {
                                            totalQuantity
                                        }
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>

                                    <span>
                                        $
                                        {subtotal.toFixed(
                                            2
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Discount
                                    </span>

                                    <span>
                                        -$
                                        {discountAmount.toFixed(
                                            2
                                        )}
                                    </span>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">
                                            Total
                                        </span>

                                        <span className="text-xl font-bold">
                                            $
                                            {discountedTotal.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CartPage;