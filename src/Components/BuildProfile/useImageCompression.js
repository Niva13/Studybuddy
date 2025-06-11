"use client";
import { useCallback } from "react";

const useImageCompression = () => {
    const compressImage = useCallback((file, maxSize = 512) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();

                img.onload = () => {
                    let width = img.width;
                    let height = img.height;

                    if (width > height && width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    } else if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }

                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
                    resolve(compressedDataUrl);
                };

                img.onerror = () => reject("Failed to load image.");
                img.src = e.target.result;
            };

            reader.onerror = () => reject("Failed to read image.");
            reader.readAsDataURL(file);
        });
    }, []);

    return { compressImage };
};

export default useImageCompression;
