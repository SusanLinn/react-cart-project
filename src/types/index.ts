export interface Address {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    country: string;
}

export interface Company {
    department: string;
    name: string;
    title: string;
    address: Address;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    username: string;
    birthDate: string;
    image: string;
    address: Address;
    university: string;
    company: Company;
    role: string;
}

export interface Review {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand?: string;
    sku: string;
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    returnPolicy: string;
    thumbnail: string;
    images: string[];
    reviews: Review[];
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface Category {
    slug: string;
    name: string;
    url: string;
}

export interface ProductFilters {
    category: string | null;
    minPrice: number | null;
    maxPrice: number | null;
}

export interface CartProduct {
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    discountPercentage: number;
    discountedTotal: number;
    thumbnail: string;
}

export interface Cart {
    id: number;
    products: CartProduct[];
    total: number;
    discountedTotal: number;
    userId: number;
    totalProducts: number;
    totalQuantity: number;
}

export interface CartsResponse {
    carts: Cart[];
    total: number;
    skip: number;
    limit: number;
}