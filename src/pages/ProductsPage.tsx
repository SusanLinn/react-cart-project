import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useQuery,
} from "@tanstack/react-query";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import FilterSidebar from "../components/FilterSidebar";
import MobileFilterDrawer from "../components/MobileFilterDrawer";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import ProductList from "../components/ProductList";

import api from "../services/api";

import type {
    Category,
    Product,
    ProductFilters,
    ProductsResponse,
    User,
} from "../types";

const PRODUCTS_PER_PAGE = 6;

const ProductsPage = () => {
    const navigate = useNavigate();

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();

    const currentPage = Math.max(
        1,
        Number(
            searchParams.get("page")
        ) || 1
    );

    const accessToken =
        localStorage.getItem(
            "accessToken"
        );

    const userId =
        localStorage.getItem(
            "userId"
        );

    //filters ကတော့ UI/client state ဖြစ်တဲ့အတွက် useState() ဆက်သုံးမယ်။
    const [filters, setFilters] =
        useState<ProductFilters>({
            category: null,
            minPrice: null,
            maxPrice: null,
        });

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
                await api.get<User>(
                    "/auth/me",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

            return response.data;
        },

        enabled: Boolean(
            accessToken
        ),

        retry: false,
    });

    const {
        data: categories = [],
        isError:
            categoriesIsError,
    } = useQuery<Category[]>({
        queryKey: [
            "productCategories",
        ],

        queryFn: async () => {
            const response =
                await api.get<
                    Category[]
                >(
                    "/products/categories"
                );

            return response.data;
        },

        enabled: Boolean(
            accessToken
        ),

        retry: false,
    });

    const {
        data: products = [],
        isPending:
            productsLoading,
        isError:
            productsIsError,
    } = useQuery<Product[]>({
        queryKey: [
            "products",
            filters.category,
        ],

        queryFn: async () => {
            const endpoint =
                filters.category
                    ? `/products/category/${encodeURIComponent(
                          filters.category
                      )}?limit=0`
                    : "/products?limit=0";

            const response =
                await api.get<ProductsResponse>(
                    endpoint
                );

            return response.data
                .products;
        },

        enabled: Boolean(
            accessToken
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

            return;
        }

        if (userIsError) {
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
        }
    }, [
        accessToken,
        navigate,
        userIsError,
    ]);

    const filteredProducts =
        useMemo(() => {
            return products.filter(
                (product) => {
                    if (
                        filters.minPrice !==
                            null &&
                        product.price <
                            filters.minPrice
                    ) {
                        return false;
                    }

                    if (
                        filters.maxPrice !==
                            null &&
                        product.price >
                            filters.maxPrice
                    ) {
                        return false;
                    }

                    return true;
                }
            );
        }, [
            products,
            filters.minPrice,
            filters.maxPrice,
        ]);

    const totalPages = Math.ceil(
        filteredProducts.length /
            PRODUCTS_PER_PAGE
    );

    const startIndex =
        (currentPage - 1) *
        PRODUCTS_PER_PAGE;

    const paginatedProducts =
        filteredProducts.slice(
            startIndex,
            startIndex +
                PRODUCTS_PER_PAGE
        );

    const handleApplyFilters = (
        newFilters: ProductFilters
    ) => {
        setFilters(newFilters);

        setSearchParams({
            page: "1",
        });
    };

    const handlePageChange = (
        page: number
    ) => {
        setSearchParams({
            page: String(page),
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
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

    const error =
        categoriesIsError
            ? "Failed to load categories."
            : productsIsError
              ? "Failed to load products."
              : "";

    if (
        userLoading ||
        !user
    ) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>
                    Loading user...
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

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <h1 className="mb-8 text-2xl font-bold">
                    Products
                </h1>

                <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
                    <div className="hidden lg:block">
                        <FilterSidebar
                            categories={
                                categories
                            }
                            filters={
                                filters
                            }
                            onApply={
                                handleApplyFilters
                            }
                            radioGroupName="desktop-category"
                        />
                    </div>

                    <div>
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {
                                    filteredProducts.length
                                }{" "}
                                products
                            </p>

                            <div className="lg:hidden">
                                <MobileFilterDrawer
                                    categories={
                                        categories
                                    }
                                    filters={
                                        filters
                                    }
                                    onApply={
                                        handleApplyFilters
                                    }
                                />
                            </div>
                        </div>

                        {productsLoading ? (
                            <div className="flex min-h-[400px] items-center justify-center">
                                <p>
                                    Loading
                                    products...
                                </p>
                            </div>
                        ) : error ? (
                            <div className="flex min-h-[400px] items-center justify-center">
                                <p className="text-red-600">
                                    {error}
                                </p>
                            </div>
                        ) : filteredProducts.length ===
                          0 ? (
                            <div className="flex min-h-[400px] items-center justify-center">
                                <div className="text-center">
                                    <h2 className="font-semibold">
                                        No products
                                        found
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Try changing
                                        your filters.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <ProductList
                                    products={
                                        paginatedProducts
                                    }
                                    currentPage={
                                        currentPage
                                    }
                                />

                                {totalPages >
                                    1 && (
                                    <Pagination
                                        currentPage={
                                            currentPage
                                        }
                                        totalPages={
                                            totalPages
                                        }
                                        onPageChange={
                                            handlePageChange
                                        }
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductsPage;