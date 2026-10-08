import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";

import CartProvider from "./context/CartProvider";
import ThemeProvider from "./context/ThemeProvider";

import router from "./router/router";

createRoot(
    document.getElementById("root")!
).render(
    <StrictMode>
        <ThemeProvider>
            <CartProvider>
                <RouterProvider
                    router={router}
                />
            </CartProvider>
        </ThemeProvider>
    </StrictMode>
);