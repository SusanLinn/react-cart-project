import {
    createBrowserRouter,
    Navigate,
} from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import ProductsPage from "../pages/ProductsPage";
import UserProfilePage from "../pages/UserProfilePage";

import { authMiddleware } from "./middleware";

import CartPage from "../pages/CartPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Navigate
                to={
                    localStorage.getItem(
                        "accessToken"
                    )
                        ? "/products"
                        : "/login"
                }
                replace
            />
        ),
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/products",
        middleware: [
            authMiddleware,
        ],
        element: <ProductsPage />,
    },
    {
        path: "/products/:productId",
        middleware: [
            authMiddleware,
        ],
        element: (
            <ProductDetailPage />
        ),
    },
    {
        path: "/profile",
        middleware: [
            authMiddleware,
        ],
        element: (
            <UserProfilePage />
        ),
    },
    {
        path: "*",
        element: (
            <Navigate
                to="/"
                replace
            />
        ),
    },
    {
    path: "/cart",
    middleware: [
        authMiddleware,
    ],
    element: <CartPage />,
    },
]);

export default router;