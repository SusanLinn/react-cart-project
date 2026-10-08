import type {
    CartProduct,
    Product,
} from "../types";


export type CartAction =
    | {
          type: "LOAD_CART";
          payload: CartProduct[];
      }
    | {
          type: "ADD_TO_CART";
          payload: {
              product: Product;
              quantity: number;
          };
      }
    | {
          type: "UPDATE_QUANTITY";
          payload: {
              productId: number;
              quantity: number;
          };
      }
    | {
          type: "REMOVE_FROM_CART";
          payload: number;
      }
    | {
          type: "CLEAR_CART";
      };

const roundMoney = (
    value: number
) => {
    return Number(
        value.toFixed(2)
    );
};

const createCartProduct = (
    product: Product,
    quantity: number
): CartProduct => {
    const total =
        product.price * quantity;

    const discountedTotal =
        total *
        (1 -
            product.discountPercentage /
                100);

    return {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity,
        total: roundMoney(total),
        discountPercentage:
            product.discountPercentage,
        discountedTotal:
            roundMoney(
                discountedTotal
            ),
        thumbnail: product.thumbnail,
    };
};

export const cartReducer = (
    state: CartProduct[],
    action: CartAction
): CartProduct[] => {
    switch (action.type) {
        case "LOAD_CART":
            return action.payload;

        case "ADD_TO_CART": {
            const {
                product,
                quantity,
            } = action.payload;

            const existingProduct =
                state.find(
                    (cartProduct) =>
                        cartProduct.id ===
                        product.id
                );

            if (existingProduct) {
                return state.map(
                    (cartProduct) => {
                        if (
                            cartProduct.id !==
                            product.id
                        ) {
                            return cartProduct;
                        }

                        const newQuantity =
                            cartProduct.quantity +
                            quantity;

                        const total =
                            cartProduct.price *
                            newQuantity;

                        const discountedTotal =
                            total *
                            (1 -
                                cartProduct.discountPercentage /
                                    100);

                        return {
                            ...cartProduct,
                            quantity:
                                newQuantity,
                            total: roundMoney(
                                total
                            ),
                            discountedTotal:
                                roundMoney(
                                    discountedTotal
                                ),
                        };
                    }
                );
            }

            return [
                ...state,
                createCartProduct(
                    product,
                    quantity
                ),
            ];
        }

        case "UPDATE_QUANTITY": {
            const {
                productId,
                quantity,
            } = action.payload;

            if (quantity <= 0) {
                return state.filter(
                    (product) =>
                        product.id !==
                        productId
                );
            }

            return state.map(
                (product) => {
                    if (
                        product.id !==
                        productId
                    ) {
                        return product;
                    }

                    const total =
                        product.price *
                        quantity;

                    const discountedTotal =
                        total *
                        (1 -
                            product.discountPercentage /
                                100);

                    return {
                        ...product,
                        quantity,
                        total: roundMoney(
                            total
                        ),
                        discountedTotal:
                            roundMoney(
                                discountedTotal
                            ),
                    };
                }
            );
        }

        case "REMOVE_FROM_CART":
            return state.filter(
                (product) =>
                    product.id !==
                    action.payload
            );

        case "CLEAR_CART":
            return [];

        default:
            return state;
    }
};