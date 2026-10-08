import { useState } from "react";

import {
    SlidersHorizontal,
} from "lucide-react";

import FilterSidebar from "./FilterSidebar";

import { Button } from "./ui/button";

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "./ui/drawer";

import type {
    Category,
    ProductFilters,
} from "../types";

interface MobileFilterDrawerProps {
    categories: Category[];
    filters: ProductFilters;
    onApply: (
        filters: ProductFilters
    ) => void;
}

const MobileFilterDrawer = ({
    categories,
    filters,
    onApply,
}: MobileFilterDrawerProps) => {
    const [open, setOpen] =
        useState(false);

    const activeFilterCount =
        Number(filters.category !== null) +
        Number(filters.minPrice !== null) +
        Number(filters.maxPrice !== null);

    const handleApply = (
        newFilters: ProductFilters
    ) => {
        onApply(newFilters);
        setOpen(false);
    };

    return (
        <Drawer
            open={open}
            onOpenChange={setOpen}
            swipeDirection="down"
            showSwipeHandle
        >
            <DrawerTrigger
                render={
                    <Button
                        variant="outline"
                        size="sm"
                    />
                }
            >
                <SlidersHorizontal className="size-4" />

                <span>
                    Filter
                </span>

                {activeFilterCount > 0 && (
                    <span>
                        ({activeFilterCount})
                    </span>
                )}
            </DrawerTrigger>

            <DrawerContent className="max-h-[85dvh]">
                <DrawerHeader className="sr-only">
                    <DrawerTitle>
                        Product Filters
                    </DrawerTitle>

                    <DrawerDescription>
                        Filter products by
                        category and price.
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto p-4">
                    <FilterSidebar
                        categories={categories}
                        filters={filters}
                        onApply={handleApply}
                        radioGroupName="mobile-category"
                    />
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default MobileFilterDrawer;