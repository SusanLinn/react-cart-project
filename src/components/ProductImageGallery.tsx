import { useState } from "react";

interface ProductImageGalleryProps {
    images: string[];
    title: string;
}

const ProductImageGallery = ({
    images,
    title,
}: ProductImageGalleryProps) => {
    const [selectedImage, setSelectedImage] =
        useState(images[0] ?? "");

    return (
        <div>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-muted/40 p-6">
                <img
                    src={selectedImage}
                    alt={title}
                    className="h-full w-full object-contain"
                />
            </div>

            {images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                    {images.map((image) => (
                        <button
                            key={image}
                            type="button"
                            onClick={() =>
                                setSelectedImage(
                                    image
                                )
                            }
                            className={`flex aspect-square items-center justify-center overflow-hidden rounded-lg border p-2 ${
                                selectedImage ===
                                image
                                    ? "border-foreground"
                                    : "border-border"
                            }`}
                        >
                            <img
                                src={image}
                                alt={title}
                                className="h-full w-full object-contain"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductImageGallery;