'use client'

import { useRef, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";



interface AddCategoryModalProps {
    isOpen: boolean
    fetchCategories: () => void
    onClose: () => void


}

export default function AddCategoryModal({ isOpen, onClose, fetchCategories }: AddCategoryModalProps) {
    if (!isOpen) return null;

    const modalRef = useRef<HTMLDivElement>(null)
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!categoryName) {
            toast.error("Please enter a category name.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/addCategory', { name: categoryName });
            console.log('Category added:', response.data);
            fetchCategories()
            onClose();
        } catch (error) {
            console.error('Error adding category:', error);
            alert("There was an error adding the category.");
        }
    };



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-white w-[400px] p-6 rounded-[24px] shadow-lg relative">
                <h2 className="text-[18px] mb-4">Add Category</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            id="categoryName"
                            placeholder="Name"
                            className="w-full px-4 py-3 border border-white rounded-md bg-[#F2F2F2] outline-none"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="bg-black text-white px-4 py-3 rounded-md w-full">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
