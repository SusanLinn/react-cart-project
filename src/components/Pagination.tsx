import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) => {
    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];

        //Total pages 7 ထက်မကျော်ရင်
        if (totalPages <= 7) {
            for (
                let page = 1;
                page <= totalPages;
                page++
            ) {
                pages.push(page);
            }

            return pages;
        }

        //Current page က အစပိုင်းနားမှာရှိရင်
        if (currentPage <= 4) {
            pages.push(
                1,
                2,
                3,
                4,
                5,
                "...",
                totalPages
            );

            return pages;
        }

        //Current page က အဆုံးနားမှာရှိရင်
        if (
            currentPage >=
            totalPages - 3
        ) {
            pages.push(
                1,
                "...",
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
            );

            return pages;
        }

        //Current page က အလယ်မှာရှိရင်
        pages.push(
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages
        );

        return pages;
    };

    const pages = getPageNumbers();

    //Previous button function
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(
                currentPage - 1
            );
        }
    };

    //Next buttond function
    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(
                currentPage + 1
            );
        }
    };

    return (
        <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-2">
                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="flex size-9 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-30"
                >
                    <ChevronLeft className="size-5" />
                </button>

                {pages.map(
                    (page, index) => {
                        if (page === "...") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="flex size-9 items-center justify-center"
                                >
                                    ...
                                </span>
                            );
                        }

                        return (
                            <button
                                key={page}
                                type="button"
                                onClick={() =>
                                    onPageChange(
                                        page
                                    )
                                }
                                className={`flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                                    currentPage ===
                                    page
                                        ? "bg-foreground text-background"
                                        : "hover:bg-background"
                                }`}
                            >
                                {page}
                            </button>
                        );
                    }
                )}

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={
                        currentPage ===
                        totalPages
                    }
                    className="flex size-9 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-30"
                >
                    <ChevronRight className="size-5" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;