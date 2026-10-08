import {
    Minus,
    Plus,
    Trash2,
} from "lucide-react";

import { Button } from "./ui/button";

import type { CartProduct } from "../types";

interface CartItemProps {
    product: CartProduct;

    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;
}

const CartItem = ({
    product,
    onIncrease,
    onDecrease,
    onRemove,
}: CartItemProps) => {
    return (
        <div className="grid gap-4 border-b py-6 last:border-b-0 sm:grid-cols-[100px_1fr_auto] sm:items-center">
            <div className="flex size-24 items-center justify-center overflow-hidden rounded-lg bg-muted/40 p-2">
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-contain"
                />
            </div>

            <div>
                <h2 className="font-semibold">
                    {product.title}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    ${product.price.toFixed(2)} each
                </p>

                <div className="mt-4 flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={onDecrease}
                    >
                        <Minus className="size-4" />
                    </Button>

                    <span className="min-w-8 text-center font-semibold">
                        {product.quantity}
                    </span>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={onIncrease}
                    >
                        <Plus className="size-4" />
                    </Button>
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    className="mt-3 px-0 text-red-600 hover:text-red-600"
                    onClick={onRemove}
                >
                    <Trash2 className="size-4" />

                    Remove
                </Button>
            </div>

            <div className="sm:text-right">
                {product.discountPercentage >
                    0 && (
                    <>
                        <p className="text-sm text-muted-foreground line-through">
                            $
                            {product.total.toFixed(
                                2
                            )}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            {
                                product.discountPercentage
                            }
                            % discount
                        </p>
                    </>
                )}

                <p className="mt-1 text-lg font-bold">
                    $
                    {product.discountedTotal.toFixed(
                        2
                    )}
                </p>
            </div>
        </div>
    );
};

export default CartItem;