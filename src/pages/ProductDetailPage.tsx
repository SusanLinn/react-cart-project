import {
    useEffect,
    useState,
} from "react";

import {
    useQuery,
} from "@tanstack/react-query";

import {
    ArrowLeft,
    Minus,
    Plus,
    ShoppingCart,
    Star,
} from "lucide-react";

import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductReviews from "../components/ProductReviews";

import { Button } from "../components/ui/button";

import { useCartStore } from "../stores/useCartStore";

import api from "../services/api";

import type {
    Product,
    User,
} from "../types";

import {
    userSchema,
} from "../schemas/userSchemas";

import {
    productSchema,
} from "../schemas/productSchemas";

const ProductDetailPage = () => {
    const navigate = useNavigate();

    const { productId } =
        useParams();

    const [searchParams] =
        useSearchParams();

    const accessToken =
        localStorage.getItem(
            "accessToken"
        );

    const userId =
        localStorage.getItem(
            "userId"
        );

    const addToCart =
        useCartStore(
            (state) =>
                state.addToCart
        );

    const fromPage = Math.max(
        1,
        Number(
            searchParams.get("fromPage")
        ) || 1
    );

    const [quantity, setQuantity] =
        useState(1);

    const [
        addedMessage,
        setAddedMessage,
    ] = useState("");

    const {
        data: user,
        isPending: userLoading,
        isError: userIsError,
    } = useQuery<User>({
        queryKey: [
            "currentUser",
            userId,
        ],

        queryFn: async () => {
            const response =
                await api.get(
                    "/auth/me"
                );

            return userSchema.parse(
                response.data
            );
        },

        enabled: Boolean(
            accessToken
        ),

        retry: false,
    });

        const {
            data: product,
            isPending:
                productLoading,
            isError:
                productIsError,
        } = useQuery<Product>({
            queryKey: [
                "product",
                productId,
            ],

            queryFn: async () => {
                const response =
                    await api.get(
                        `/products/${productId}`
                    );

                return productSchema.parse(
                    response.data
                );
            },

            enabled: Boolean(
                accessToken &&
                    productId
            ),

            retry: false,
        });

    useEffect(() => {
        if (!accessToken) {
            navigate(
                "/login",
                {
                    replace: true,
                }
            );
        }
    }, [
        accessToken,
        navigate,
    ]);

    const handleIncreaseQuantity =
        () => {
            if (!product) {
                return;
            }

            if (
                quantity <
                product.stock
            ) {
                setQuantity(
                    (
                        previousQuantity
                    ) =>
                        previousQuantity +
                        1
                );
            }
        };

    const handleDecreaseQuantity =
        () => {
            if (quantity > 1) {
                setQuantity(
                    (
                        previousQuantity
                    ) =>
                        previousQuantity -
                        1
                );
            }
        };

    const handleAddToCart = () => {
        if (!product) {
            return;
        }

        addToCart(
            product,
            quantity
        );

        setAddedMessage(
            "Added to cart!"
        );

        setQuantity(1);

        window.setTimeout(() => {
            setAddedMessage("");
        }, 2000);
    };

    const handleLogout = () => {
        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "userId"
        );

        window.dispatchEvent(
            new Event(
                "theme-user-changed"
            )
        );

        window.dispatchEvent(
            new Event(
                "cart-user-changed"
            )
        );

        navigate(
            "/login",
            {
                replace: true,
            }
        );
    };

    if (!productId) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">
                        Product not found.
                    </p>

                    <Link
                        to={`/products?page=${fromPage}`}
                        className="mt-4 inline-block underline"
                    >
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    if (
        userLoading ||
        productLoading
    ) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>
                    Loading product...
                </p>
            </div>
        );
    }

    if (
        userIsError ||
        !user
    ) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">
                        Failed to load user.
                    </p>

                    <Link
                        to={`/products?page=${fromPage}`}
                        className="mt-4 inline-block underline"
                    >
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    if (
        productIsError ||
        !product
    ) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">
                        Failed to load
                        product.
                    </p>

                    <Link
                        to={`/products?page=${fromPage}`}
                        className="mt-4 inline-block underline"
                    >
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar
                user={user}
                onLogout={handleLogout}
            />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <Link
                    to={`/products?page=${fromPage}`}
                    className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />

                    Back to Products
                </Link>

                <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
                    <ProductImageGallery
                        images={
                            product.images
                        }
                        title={
                            product.title
                        }
                    />

                    <div>
                        <p className="mb-2 text-sm capitalize text-muted-foreground">
                            {
                                product.category
                            }
                        </p>

                        <h1 className="text-3xl font-bold leading-tight">
                            {
                                product.title
                            }
                        </h1>

                        <div className="mt-4 flex items-center gap-2">
                            <Star className="size-5 fill-current" />

                            <span className="font-medium">
                                {
                                    product.rating
                                }
                            </span>

                            <span className="text-sm text-muted-foreground">
                                (
                                {
                                    product
                                        .reviews
                                        .length
                                }{" "}
                                reviews)
                            </span>
                        </div>

                        <p className="mt-6 text-3xl font-semibold">
                            $
                            {product.price.toFixed(
                                2
                            )}
                        </p>

                        <div className="mt-6 border-y py-6">
                            <p className="leading-7 text-muted-foreground">
                                {
                                    product.description
                                }
                            </p>
                        </div>

                        <div className="mt-6">
                            <p className="mb-3 text-sm font-medium">
                                Quantity
                            </p>

                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={
                                        handleDecreaseQuantity
                                    }
                                    disabled={
                                        quantity ===
                                        1
                                    }
                                >
                                    <Minus className="size-4" />
                                </Button>

                                <span className="min-w-8 text-center font-semibold">
                                    {quantity}
                                </span>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={
                                        handleIncreaseQuantity
                                    }
                                    disabled={
                                        quantity >=
                                        product.stock
                                    }
                                >
                                    <Plus className="size-4" />
                                </Button>
                            </div>

                            <p className="mt-2 text-xs text-muted-foreground">
                                {product.stock}{" "}
                                items available
                            </p>
                        </div>

                        <Button
                            type="button"
                            className="mt-6 w-full sm:w-auto"
                            onClick={
                                handleAddToCart
                            }
                            disabled={
                                product.stock ===
                                0
                            }
                        >
                            <ShoppingCart className="size-4" />

                            Add to Cart
                        </Button>

                        {addedMessage && (
                            <p className="mt-3 text-sm font-medium">
                                {
                                    addedMessage
                                }
                            </p>
                        )}

                        <dl className="mt-8 space-y-4 text-sm">
                            {product.brand && (
                                <div className="flex justify-between gap-6">
                                    <dt className="text-muted-foreground">
                                        Brand
                                    </dt>

                                    <dd className="font-medium">
                                        {
                                            product.brand
                                        }
                                    </dd>
                                </div>
                            )}

                            <div className="flex justify-between gap-6">
                                <dt className="text-muted-foreground">
                                    Availability
                                </dt>

                                <dd className="font-medium">
                                    {
                                        product.availabilityStatus
                                    }
                                </dd>
                            </div>

                            <div className="flex justify-between gap-6">
                                <dt className="text-muted-foreground">
                                    Stock
                                </dt>

                                <dd className="font-medium">
                                    {
                                        product.stock
                                    }
                                </dd>
                            </div>

                            <div className="flex justify-between gap-6">
                                <dt className="text-muted-foreground">
                                    Shipping
                                </dt>

                                <dd className="text-right font-medium">
                                    {
                                        product.shippingInformation
                                    }
                                </dd>
                            </div>

                            <div className="flex justify-between gap-6">
                                <dt className="text-muted-foreground">
                                    Warranty
                                </dt>

                                <dd className="text-right font-medium">
                                    {
                                        product.warrantyInformation
                                    }
                                </dd>
                            </div>

                            <div className="flex justify-between gap-6">
                                <dt className="text-muted-foreground">
                                    Return Policy
                                </dt>

                                <dd className="text-right font-medium">
                                    {
                                        product.returnPolicy
                                    }
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <ProductReviews
                    reviews={
                        product.reviews
                    }
                />
            </main>
        </div>
    );
};

export default ProductDetailPage;