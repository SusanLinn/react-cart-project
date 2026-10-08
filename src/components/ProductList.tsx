import {
    motion,
    stagger,
} from "motion/react";

import ProductCard from "./ProductCard";

import type { Product } from "../types";

interface ProductListProps {
    products: Product[];
    currentPage: number;
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            delayChildren: stagger(0.1),
        },
    },
};

const productVariants = {
    hidden: {
        opacity: 0,
        x: -40,
    },

    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut" as const,
        },
    },
};

//to restart the page animation when the page change
const ProductList = ({
    products,
    currentPage,
}: ProductListProps) => {
    const productKey = products
        .map((product) => product.id)
        .join("-");

    return (
        <motion.div
            key={productKey}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3"
        >
            {products.map((product) => (
                <motion.div
                    key={product.id}
                    variants={productVariants}
                >
                    <ProductCard
                        product={product}
                        currentPage={currentPage}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default ProductList;