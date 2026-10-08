import { Star } from "lucide-react";

import type { Review } from "../types";

interface ProductReviewsProps {
    reviews: Review[];
}

const ProductReviews = ({
    reviews,
}: ProductReviewsProps) => {
    const formatDate = (
        dateString: string
    ) => {
        return new Date(
            dateString
        ).toLocaleDateString();
    };

    return (
        <section className="mt-12 border-t pt-10">
            <h2 className="mb-6 text-2xl font-bold">
                Customer Reviews
            </h2>

            {reviews.length === 0 ? (
                <p className="text-muted-foreground">
                    No reviews yet.
                </p>
            ) : (
                <div className="space-y-6">
                    {reviews.map(
                        (review, index) => (
                            <article
                                key={`${review.reviewerEmail}-${index}`}
                                className="border-b pb-6"
                            >
                                <div className="mb-2 flex items-center gap-1">
                                    {Array.from({
                                        length: 5,
                                    }).map(
                                        (
                                            _,
                                            starIndex
                                        ) => (
                                            <Star
                                                key={
                                                    starIndex
                                                }
                                                className={`size-4 ${
                                                    starIndex <
                                                    review.rating
                                                        ? "fill-current"
                                                        : "opacity-30"
                                                }`}
                                            />
                                        )
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <p className="font-semibold">
                                        {
                                            review.reviewerName
                                        }
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(
                                            review.date
                                        )}
                                    </p>
                                </div>

                                <p className="mt-3 text-sm leading-6">
                                    {
                                        review.comment
                                    }
                                </p>
                            </article>
                        )
                    )}
                </div>
            )}
        </section>
    );
};

export default ProductReviews;