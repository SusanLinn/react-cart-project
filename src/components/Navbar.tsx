import {
    ShoppingCart,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import ProfileMenu from "./ProfileMenu";
import { useCartStore } from "../stores/useCartStore";

import { Button } from "./ui/button";

import type { User } from "../types";

interface NavbarProps {
    user: User;
    onLogout: () => void;
}

const Navbar = ({
    user,
    onLogout,
}: NavbarProps) => {
const totalQuantity =
            useCartStore(
                (state) =>
                    state.cartProducts.reduce(
                        (
                            total,
                            product
                        ) =>
                            total +
                            product.quantity,
                        0
                    )
            );

    return (
        <header className="border-b bg-background">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <Link
                    to="/products"
                    className="text-xl font-bold"
                >
                    Products
                </Link>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        nativeButton={false}
                        render={
                            <Link
                                to="/cart"
                                className="relative"
                            />
                        }
                    >
                        <ShoppingCart className="size-5" />

                        {totalQuantity > 0 && (
                            <span className="absolute -right-2 -top-2 flex min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-xs font-semibold text-background">
                                {totalQuantity}
                            </span>
                        )}
                    </Button>

                    <ProfileMenu
                        user={user}
                        onLogout={onLogout}
                    />
                </div>
            </div>
        </header>
    );
};

export default Navbar;