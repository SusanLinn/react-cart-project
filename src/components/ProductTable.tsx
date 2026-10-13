import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Search,
} from "lucide-react";

import {
    columnFilteringFeature,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    filterFn_includesString,
    globalFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
    sortFn_basic,
    sortFn_text,
    tableFeatures,
    useTable,
    type ColumnDef,
} from "@tanstack/react-table";

import {
    Button,
} from "./ui/button";

import {
    Input,
} from "./ui/input";

import type {
    Product,
} from "../types";

interface ProductTableProps {
    products: Product[];
}

const features =
    tableFeatures({
        columnFilteringFeature,

        globalFilteringFeature,

        filteredRowModel:
            createFilteredRowModel(),

        filterFns: {
            includesString:
                filterFn_includesString,
        },

        rowSortingFeature,

        sortedRowModel:
            createSortedRowModel(),

        sortFns: {
            text:
                sortFn_text,

            basic:
                sortFn_basic,
        },

        rowPaginationFeature,

        paginatedRowModel:
            createPaginatedRowModel(),
    });

const columns: Array<
    ColumnDef<
        typeof features,
        Product
    >
> = [
    {
        accessorKey: "title",
        header: "Product",
        sortFn: "text",
    },

    {
        accessorKey: "category",
        header: "Category",
        sortFn: "text",
    },

    {
        accessorKey: "price",
        header: "Price",
        sortFn: "basic",

        cell: (info) => {
            const price =
                info.getValue<number>();

            return `$${price.toFixed(2)}`;
        },
    },

    {
        accessorKey: "rating",
        header: "Rating",
        sortFn: "basic",
    },

    {
        accessorKey: "stock",
        header: "Stock",
        sortFn: "basic",
    },
];

const ProductTable = ({
    products,
}: ProductTableProps) => {
    const table =
        useTable({
            key: "product-table",

            features,

            columns,

            data: products,

            globalFilterFn:
                "includesString",

            initialState: {
                pagination: {
                    pageIndex: 0,
                    pageSize: 6,
                },
            },
        });

    return (
        <div className="space-y-4">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    type="text"
                    placeholder="Search table..."
                    value={
                        table.state
                            .globalFilter ??
                        ""
                    }
                    onChange={(
                        event
                    ) =>
                        table.setGlobalFilter(
                            event.target
                                .value
                        )
                    }
                    className="pl-9"
                />
            </div>

            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full">
                    <thead className="border-b bg-muted/50">
                        {table
                            .getHeaderGroups()
                            .map(
                                (
                                    headerGroup
                                ) => (
                                    <tr
                                        key={
                                            headerGroup.id
                                        }
                                    >
                                        {headerGroup.headers.map(
                                            (
                                                header
                                            ) => {
                                                const sorting =
                                                    header.column
                                                        .getIsSorted();

                                                return (
                                                    <th
                                                        key={
                                                            header.id
                                                        }
                                                        className="px-4 py-3 text-left text-sm font-medium"
                                                    >
                                                        {header.isPlaceholder
                                                            ? null
                                                            : (
                                                                <button
                                                                    type="button"
                                                                    className="flex cursor-pointer items-center gap-2 rounded-sm hover:text-foreground"
                                                                    onClick={
                                                                        header.column
                                                                            .getToggleSortingHandler()
                                                                    }
                                                                    disabled={
                                                                        !header.column
                                                                            .getCanSort()
                                                                    }
                                                                >
                                                                    <table.FlexRender
                                                                        header={
                                                                            header
                                                                        }
                                                                    />

                                                                    {sorting ===
                                                                    "asc" ? (
                                                                        <ArrowUp className="size-4" />
                                                                    ) : sorting ===
                                                                      "desc" ? (
                                                                        <ArrowDown className="size-4" />
                                                                    ) : (
                                                                        <ArrowUpDown className="size-4 opacity-50" />
                                                                    )}
                                                                </button>
                                                            )}
                                                    </th>
                                                );
                                            }
                                        )}
                                    </tr>
                                )
                            )}
                    </thead>

                    <tbody>
                        {table
                            .getRowModel()
                            .rows.map(
                                (row) => (
                                    <tr
                                        key={
                                            row.id
                                        }
                                        className="border-b last:border-b-0"
                                    >
                                        {row
                                            .getAllCells()
                                            .map(
                                                (
                                                    cell
                                                ) => (
                                                    <td
                                                        key={
                                                            cell.id
                                                        }
                                                        className="px-4 py-3 text-sm"
                                                    >
                                                        <table.FlexRender
                                                            cell={
                                                                cell
                                                            }
                                                        />
                                                    </td>
                                                )
                                            )}
                                    </tr>
                                )
                            )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Page{" "}
                    {
                        table.state
                            .pagination
                            .pageIndex +
                        1
                    }{" "}
                    of{" "}
                    {
                        table.getPageCount()
                    }
                </p>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            table.previousPage()
                        }
                        disabled={
                            !table.getCanPreviousPage()
                        }
                    >
                        Previous
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            table.nextPage()
                        }
                        disabled={
                            !table.getCanNextPage()
                        }
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductTable;