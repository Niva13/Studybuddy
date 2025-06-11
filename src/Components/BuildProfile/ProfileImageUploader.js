"use client";
import { useRef } from "react";

const ProfileImageUploader = ({ onImageChange }) => {
    const fileInputRef = useRef(null);

    return (
        <div className="new-expense__control">
            <label htmlFor="Image">Choose an image:</label>
            <input
                margin="dense"
                label="image"
                type="file"
                name="image"
                fullWidth
                accept=".jpg,.jpeg,.png"
                onChange={(e) => onImageChange(e)}
                ref={fileInputRef}
            />
        </div>
    );
};

export default ProfileImageUploader;
