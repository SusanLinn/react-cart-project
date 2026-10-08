import {
    useEffect,
    useState,
} from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

import type {
    Category,
    ProductFilters,
} from "../types";

interface FilterSidebarProps {
    categories: Category[];
    filters: ProductFilters;
    onApply: (
        filters: ProductFilters
    ) => void;
    radioGroupName: string;
}

const FilterSidebar = ({
    categories,
    filters,
    onApply,
    radioGroupName,
}: FilterSidebarProps) => {
    const [
        selectedCategory,
        setSelectedCategory,
    ] = useState(
        filters.category ?? "all"
    );

    const [minPrice, setMinPrice] =
        useState(
            filters.minPrice?.toString() ??
                ""
        );

    const [maxPrice, setMaxPrice] =
        useState(
            filters.maxPrice?.toString() ??
                ""
        );

    const [error, setError] =
        useState("");

    useEffect(() => {
        setSelectedCategory(
            filters.category ?? "all"
        );

        setMinPrice(
            filters.minPrice?.toString() ??
                ""
        );

        setMaxPrice(
            filters.maxPrice?.toString() ??
                ""
        );

        setError("");
    }, [filters]);

    const handleApply = () => {
        setError("");

        const parsedMinPrice =
            minPrice.trim() === ""
                ? null
                : Number(minPrice);

        const parsedMaxPrice =
            maxPrice.trim() === ""
                ? null
                : Number(maxPrice);

        if (
            parsedMinPrice !== null &&
            parsedMinPrice < 0
        ) {
            setError(
                "Minimum price cannot be negative."
            );

            return;
        }

        if (
            parsedMaxPrice !== null &&
            parsedMaxPrice < 0
        ) {
            setError(
                "Maximum price cannot be negative."
            );

            return;
        }

        if (
            parsedMinPrice !== null &&
            parsedMaxPrice !== null &&
            parsedMinPrice >
                parsedMaxPrice
        ) {
            setError(
                "Minimum price cannot be greater than maximum price."
            );

            return;
        }

        onApply({
            category:
                selectedCategory === "all"
                    ? null
                    : selectedCategory,
            minPrice: parsedMinPrice,
            maxPrice: parsedMaxPrice,
        });
    };

    const handleClear = () => {
        setSelectedCategory("all");
        setMinPrice("");
        setMaxPrice("");
        setError("");

        onApply({
            category: null,
            minPrice: null,
            maxPrice: null,
        });
    };

    return (
        <aside className="rounded-xl border bg-background p-5">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Filters
                </h2>

                <button
                    type="button"
                    onClick={handleClear}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    Clear
                </button>
            </div>

            <div>
                <h3 className="mb-3 font-medium">
                    Category
                </h3>

                <div className="max-h-64 space-y-3 overflow-y-auto pr-2">
                    <label className="flex cursor-pointer items-center gap-3 text-sm">
                        <input
                            type="radio"
                            name={radioGroupName}
                            value="all"
                            checked={
                                selectedCategory ===
                                "all"
                            }
                            onChange={() =>
                                setSelectedCategory(
                                    "all"
                                )
                            }
                            className="size-4"
                        />

                        <span>
                            All Products
                        </span>
                    </label>

                    {categories.map(
                        (category) => (
                            <label
                                key={
                                    category.slug
                                }
                                className="flex cursor-pointer items-center gap-3 text-sm"
                            >
                                <input
                                    type="radio"
                                    name={
                                        radioGroupName
                                    }
                                    value={
                                        category.slug
                                    }
                                    checked={
                                        selectedCategory ===
                                        category.slug
                                    }
                                    onChange={() =>
                                        setSelectedCategory(
                                            category.slug
                                        )
                                    }
                                    className="size-4"
                                />

                                <span>
                                    {
                                        category.name
                                    }
                                </span>
                            </label>
                        )
                    )}
                </div>
            </div>

            <div className="my-6 border-t" />

            <div>
                <h3 className="mb-3 font-medium">
                    Price Range
                </h3>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="mb-2 block text-xs text-muted-foreground">
                            Min
                        </label>

                        <Input
                            type="number" //numeric input
                            min="0" //browser-side minimum 0
                            step="0.01" //decimal prices allowed
                            placeholder="$0"
                            value={minPrice}
                            onChange={(event) =>
                                setMinPrice(
                                    event.target
                                        .value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs text-muted-foreground">
                            Max
                        </label>

                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Any"
                            value={maxPrice}
                            onChange={(event) =>
                                setMaxPrice(
                                    event.target
                                        .value
                                )
                            }
                        />
                    </div>
                </div>
            </div>

            {error && (
                <p className="mt-3 text-sm text-red-600">
                    {error}
                </p>
            )}

            <Button
                type="button"
                className="mt-6 w-full"
                onClick={handleApply}
            >
                Apply Filters
            </Button>
        </aside>
    );
};

export default FilterSidebar;