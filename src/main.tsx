import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";

import ThemeProvider from "./context/ThemeProvider";

import CartStoreInitializer from "./stores/CartStoreInitializer";

import router from "./router/router";

createRoot(
    document.getElementById("root")!
).render(
    <StrictMode>
        <ThemeProvider>
            <CartStoreInitializer />
            <RouterProvider
                router={router}
            />
        </ThemeProvider>
    </StrictMode>
);