import {
    useState,
    type ChangeEvent,
} from "react";

import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Columns3,
    Search,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    columnFilteringFeature,
    columnVisibilityFeature,
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

import Pagination from "./Pagination";

import type {
    Product,
} from "../types";


const features =
    tableFeatures({
        columnFilteringFeature,
        globalFilteringFeature,
        columnVisibilityFeature,
        rowSortingFeature,
        rowPaginationFeature,

        filteredRowModel:
            createFilteredRowModel(),

        sortedRowModel:
            createSortedRowModel(),

        paginatedRowModel:
            createPaginatedRowModel(),

        filterFns: {
            includesString:
                filterFn_includesString,
        },

        sortFns: {
            text: sortFn_text,
            basic: sortFn_basic,
        },
    });


const columns: ColumnDef<
    typeof features,
    Product
>[] = [
    {
        id: "productInfo",

        header: "Product Information",

        columns: [
            {
                accessorKey: "thumbnail",

                header: "Image",

                enableSorting: false,

                enableGlobalFilter: false,

                cell: (info) => {
                    const product =
                        info.row.original;

                    return (
                        <Link
                            to={`/products/${product.id}`}
                        >
                            <img
                                src={
                                    product.thumbnail
                                }
                                alt={
                                    product.title
                                }
                                className="h-14 w-14 rounded-md object-cover"
                            />
                        </Link>
                    );
                },
            },

            {
                accessorKey: "title",

                header: "Title",

                sortFn: "text",

                cell: (info) => {
                    const product =
                        info.row.original;

                    return (
                        <Link
                            to={`/products/${product.id}`}
                            className="font-medium hover:underline"
                        >
                            {
                                product.title
                            }
                        </Link>
                    );
                },
            },

            {
                accessorKey: "category",

                header: "Category",

                sortFn: "text",

                cell: (info) => (
                    <span className="capitalize">
                        {
                            info.getValue<string>()
                        }
                    </span>
                ),
            },
        ],
    },

    {
        id: "productDetails",

        header: "Product Details",

        columns: [
            {
                accessorKey: "price",

                header: "Price",

                sortFn: "basic",

                cell: (info) => (
                    <span>
                        $
                        {
                            info
                                .getValue<number>()
                                .toFixed(2)
                        }
                    </span>
                ),
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
        ],
    },
];


interface ProductTableProps {
    products: Product[];
}


const ProductTable = ({
    products,
}: ProductTableProps) => {

    const [
        showColumnMenu,
        setShowColumnMenu,
    ] = useState(false);


    const table = useTable({
        features,

        data: products,

        columns,

        globalFilterFn:
            "includesString",

        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 6,
            },
        },
    });


    const pageSizeOptions = [
        6,
        20,
        50,
        100,
    ];


    const currentPage =
        table.state.pagination
            .pageIndex + 1;


    const currentPageSize =
        table.state.pagination
            .pageSize;


    const totalPages =
        table.getPageCount();


    const displayTotalPages =
        Math.max(
            totalPages,
            1
        );


    const handleGlobalSearch = (
        event:
            ChangeEvent<HTMLInputElement>
    ) => {

        table.setGlobalFilter(
            event.target.value
        );

        table.setPageIndex(0);
    };


    const handlePageSizeChange = (
        pageSize: number
    ) => {

        table.setPageSize(
            pageSize
        );

        table.setPageIndex(0);
    };


    const handlePageChange = (
        page: number
    ) => {

        table.setPageIndex(
            page - 1
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    const getSortIcon = (
        sortDirection:
            false |
            "asc" |
            "desc"
    ) => {

        if (
            sortDirection ===
            "asc"
        ) {
            return (
                <ArrowUp className="size-4" />
            );
        }


        if (
            sortDirection ===
            "desc"
        ) {
            return (
                <ArrowDown className="size-4" />
            );
        }


        return (
            <ArrowUpDown className="size-4 opacity-50" />
        );
    };


    return (
        <div className="space-y-4">

            {/* Search + Columns */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* Search */}
                <div className="relative w-full sm:max-w-sm">

                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                        type="text"
                        value={
                            String(
                                table
                                    .state
                                    .globalFilter ??
                                    ""
                            )
                        }
                        onChange={
                            handleGlobalSearch
                        }
                        placeholder="Search products..."
                        className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-foreground"
                    />

                </div>


                {/* Column Visibility */}
                <div className="relative self-start sm:self-auto">

                    <button
                        type="button"
                        onClick={() =>
                            setShowColumnMenu(
                                (
                                    previous
                                ) =>
                                    !previous
                            )
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium transition hover:bg-muted"
                    >
                        <Columns3 className="size-4" />

                        Columns
                    </button>


                    {showColumnMenu && (
                        <div
                            className="
                                absolute
                                left-0
                                top-12
                                z-50
                                w-56
                                max-w-[calc(100vw-2rem)]
                                rounded-lg
                                border
                                bg-background
                                p-2
                                shadow-lg
                                sm:left-auto
                                sm:right-0
                            "
                        >

                            <p className="px-2 pb-2 text-xs font-medium text-muted-foreground">
                                Show / Hide Columns
                            </p>


                            <div className="max-h-64 overflow-y-auto">

                                {table
                                    .getAllLeafColumns()
                                    .filter(
                                        (
                                            column
                                        ) =>
                                            column.getCanHide()
                                    )
                                    .map(
                                        (
                                            column
                                        ) => (
                                            <label
                                                key={
                                                    column.id
                                                }
                                                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        column.getIsVisible()
                                                    }
                                                    onChange={
                                                        column.getToggleVisibilityHandler()
                                                    }
                                                />

                                                <span className="capitalize">
                                                    {
                                                        column.id
                                                    }
                                                </span>
                                            </label>
                                        )
                                    )}

                            </div>

                        </div>
                    )}

                </div>

            </div>


            {/* Table */}
            <div className="overflow-hidden rounded-xl border">

                <div className="max-h-[520px] overflow-auto">

                    <table className="w-full min-w-[750px] border-collapse text-sm">

                        <thead className="sticky top-0 z-10 bg-muted">

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
                                            className="border-b"
                                        >
                                            {headerGroup.headers.map(
                                                (
                                                    header
                                                ) => {

                                                    const canSort =
                                                        header.column.getCanSort();


                                                    const sortDirection =
                                                        header.column.getIsSorted();


                                                    return (
                                                        <th
                                                            key={
                                                                header.id
                                                            }
                                                            colSpan={
                                                                header.colSpan
                                                            }
                                                            className="whitespace-nowrap px-4 py-3 text-left font-semibold"
                                                        >
                                                            {header.isPlaceholder ? null : (
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        !canSort
                                                                    }
                                                                    onClick={
                                                                        header.column.getToggleSortingHandler()
                                                                    }
                                                                    className={`inline-flex items-center gap-2 ${
                                                                        canSort
                                                                            ? "cursor-pointer hover:text-foreground"
                                                                            : "cursor-default"
                                                                    }`}
                                                                >

                                                                    <table.FlexRender
                                                                        header={
                                                                            header
                                                                        }
                                                                    />

                                                                    {canSort &&
                                                                        getSortIcon(
                                                                            sortDirection
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
                                .rows
                                .map(
                                    (
                                        row
                                    ) => (
                                        <tr
                                            key={
                                                row.id
                                            }
                                            className="border-b transition-colors last:border-b-0 hover:bg-muted/50"
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map(
                                                    (
                                                        cell
                                                    ) => (
                                                        <td
                                                            key={
                                                                cell.id
                                                            }
                                                            className="px-4 py-3 align-middle"
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


                    {table
                        .getRowModel()
                        .rows
                        .length ===
                        0 && (
                        <div className="flex min-h-40 items-center justify-center">

                            <p className="text-sm text-muted-foreground">
                                No products found.
                            </p>

                        </div>
                    )}

                </div>

            </div>


            {/* Page Size + Page Info + Pagination */}
            <div
                className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-4
                    lg:grid
                    lg:grid-cols-[auto_1fr_auto]
                    lg:items-center
                "
            >

                {/* Page Size */}
                <div className="flex items-center justify-center lg:justify-start">

                    <div className="inline-flex overflow-hidden rounded-lg border">

                        {pageSizeOptions.map(
                            (
                                pageSize
                            ) => (
                                <button
                                    key={
                                        pageSize
                                    }
                                    type="button"
                                    onClick={() =>
                                        handlePageSizeChange(
                                            pageSize
                                        )
                                    }
                                    className={`border-r px-3 py-2 text-sm transition-colors last:border-r-0 ${
                                        currentPageSize ===
                                        pageSize
                                            ? "bg-foreground text-background"
                                            : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                                >
                                    {
                                        pageSize
                                    }
                                </button>
                            )
                        )}

                    </div>

                </div>


                {/* Page Information */}
                <div className="text-center text-sm text-muted-foreground">

                    Page{" "}
                    <span className="font-medium text-foreground">
                        {
                            currentPage
                        }
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-foreground">
                        {
                            displayTotalPages
                        }
                    </span>

                </div>


                {/* Pagination */}
                <div className="flex items-center justify-center lg:justify-end [&>*]:mt-0">

                    {totalPages > 1 && (
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

                </div>

            </div>

        </div>
    );
};


export default ProductTable;