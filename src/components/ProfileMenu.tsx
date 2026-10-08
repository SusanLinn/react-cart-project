import {
    Check,
    ChevronDown,
    LogOut,
    UserRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "./ui/avatar";

import { Button } from "./ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
    Theme,
} from "../context/theme-context";

import { useTheme } from "../hooks/useTheme";

import type { User } from "../types";

interface ProfileMenuProps {
    user: User;
    onLogout: () => void;
}

const ProfileMenu = ({
    user,
    onLogout,
}: ProfileMenuProps) => {
    const navigate =
        useNavigate();

    const {
        theme,
        setTheme,
    } = useTheme();

    const initials =
        `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`
            .toUpperCase();

    const handleProfile = () => {
        navigate("/profile");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="outline"
                        className="h-auto px-3 py-2"
                    />
                }
            >
                <Avatar className="size-9">
                    <AvatarImage
                        src={user.image}
                        alt={user.firstName}
                    />

                    <AvatarFallback>
                        {initials}
                    </AvatarFallback>
                </Avatar>

                <span className="hidden sm:inline">
                    {user.firstName}{" "}
                    {user.lastName}
                </span>

                <ChevronDown className="size-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[330px] p-3">
                <DropdownMenuItem
                    onClick={
                        handleProfile
                    }
                >
                    <UserRound className="size-4" />

                    <span>
                        Profile
                    </span>
                </DropdownMenuItem>

                <div className="my-3 border-t" />

                <div className="px-1">
                    <p className="mb-3 text-sm font-medium">
                        Appearance
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setTheme(
                                    Theme.LIGHT
                                )
                            }
                            className="group"
                        >
                            <div
                                className={`relative rounded-lg border-2 p-2 transition ${
                                    theme ===
                                    Theme.LIGHT
                                        ? "border-foreground"
                                        : "border-border"
                                }`}
                            >
                                <div className="h-20 rounded-md bg-white p-2 shadow-sm">
                                    <div className="mb-2 flex gap-1">
                                        <div className="size-2 rounded-full bg-gray-300" />
                                        <div className="size-2 rounded-full bg-gray-300" />
                                        <div className="size-2 rounded-full bg-gray-300" />
                                    </div>

                                    <div className="grid grid-cols-[18px_1fr] gap-2">
                                        <div className="h-11 rounded bg-gray-100" />

                                        <div className="space-y-2">
                                            <div className="h-5 rounded bg-gray-100" />

                                            <div className="h-4 rounded bg-gray-100" />
                                        </div>
                                    </div>
                                </div>

                                {theme ===
                                    Theme.LIGHT && (
                                    <div className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-foreground text-background">
                                        <Check className="size-3" />
                                    </div>
                                )}
                            </div>

                            <p className="mt-2 text-xs">
                                Light
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setTheme(
                                    Theme.DARK
                                )
                            }
                            className="group"
                        >
                            <div
                                className={`relative rounded-lg border-2 p-2 transition ${
                                    theme ===
                                    Theme.DARK
                                        ? "border-foreground"
                                        : "border-border"
                                }`}
                            >
                                <div className="h-20 rounded-md bg-gray-900 p-2 shadow-sm">
                                    <div className="mb-2 flex gap-1">
                                        <div className="size-2 rounded-full bg-gray-600" />
                                        <div className="size-2 rounded-full bg-gray-600" />
                                        <div className="size-2 rounded-full bg-gray-600" />
                                    </div>

                                    <div className="grid grid-cols-[18px_1fr] gap-2">
                                        <div className="h-11 rounded bg-gray-700" />

                                        <div className="space-y-2">
                                            <div className="h-5 rounded bg-gray-700" />

                                            <div className="h-4 rounded bg-gray-700" />
                                        </div>
                                    </div>
                                </div>

                                {theme ===
                                    Theme.DARK && (
                                    <div className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-foreground text-background">
                                        <Check className="size-3" />
                                    </div>
                                )}
                            </div>

                            <p className="mt-2 text-xs">
                                Dark
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setTheme(
                                    Theme.SYSTEM
                                )
                            }
                            className="group"
                        >
                            <div
                                className={`relative overflow-hidden rounded-lg border-2 p-2 transition ${
                                    theme ===
                                    Theme.SYSTEM
                                        ? "border-foreground"
                                        : "border-border"
                                }`}
                            >
                                <div className="relative h-20 overflow-hidden rounded-md">
                                    <div className="absolute inset-y-0 left-0 w-1/2 bg-white" />

                                    <div className="absolute inset-y-0 right-0 w-1/2 bg-gray-900" />

                                    <div className="absolute inset-2 grid grid-cols-2 gap-1">
                                        <div className="rounded bg-gray-100/90" />

                                        <div className="rounded bg-gray-700/90" />
                                    </div>
                                </div>

                                {theme ===
                                    Theme.SYSTEM && (
                                    <div className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-foreground text-background">
                                        <Check className="size-3" />
                                    </div>
                                )}
                            </div>

                            <p className="mt-2 text-xs">
                                System
                            </p>
                        </button>
                    </div>
                </div>

                <div className="my-3 border-t" />

                <DropdownMenuItem
                    onClick={onLogout}
                    className="text-red-600 focus:text-red-600"
                >
                    <LogOut className="size-4" />

                    <span>
                        Logout
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileMenu;