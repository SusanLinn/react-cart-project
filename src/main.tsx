import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import {
    RouterProvider,
} from "react-router-dom";

import "./index.css";

import ThemeProvider from "./context/ThemeProvider";

import CartStoreInitializer from "./stores/CartStoreInitializer";

import router from "./router/router";

const queryClient =
    new QueryClient();

createRoot(
    document.getElementById("root")!
).render(
    <StrictMode>
        <QueryClientProvider
            client={queryClient}
        >
            <ThemeProvider>
                <CartStoreInitializer />

                <RouterProvider
                    router={router}
                />
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>
);