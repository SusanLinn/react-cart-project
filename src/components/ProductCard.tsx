import { Link } from "react-router-dom";

import type { Product } from "../types";

interface ProductCardProps {
    product: Product;
    currentPage: number;
}

const ProductCard = ({
    product,
    currentPage,
}: ProductCardProps) => {
    return (
        <Link
            to={`/products/${product.id}?fromPage=${currentPage}`}
            className="group block"
        >
            <div className="flex h-44 items-center justify-center overflow-hidden rounded-lg bg-muted/40 p-4">
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            <div className="mt-3 space-y-1">
                <h2 className="line-clamp-2 text-sm font-semibold leading-5 group-hover:underline">
                    {product.title}
                </h2>

                <p className="text-sm text-muted-foreground">
                    ${product.price.toFixed(2)}
                </p>
            </div>
        </Link>
    );
};

export default ProductCard;