'use client'

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

interface Category {
    id: string;
    name: string;
}

interface AddAnimalModalProps {
    isOpen: boolean
    onClose: () => void
    fetchAnimals: () => void
    categories: Category[]
}



export default function AddAnimalModal({ isOpen, onClose, fetchAnimals, categories }: AddAnimalModalProps) {
    if (!isOpen) return null;

    const router = useRouter()
    const fileRef = useRef<HTMLInputElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)
    const [fileName, setFileName] = useState("");
    const [animalName, setAnimalName] = useState("");
    const [animalCategory, setAnimalCategory] = useState(""); // ps: I can also use react-hook-form

    const handleUpload = () => {
        if (fileRef.current) {
            fileRef.current.click()
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFileName(event.target.files[0].name);
        }
    };



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

        if (!animalName || !animalCategory || !fileRef.current?.files?.length) {
            toast.error("Please fill all fields and upload a file.");
            return;
        }

        const formData = new FormData();
        formData.append("name", animalName);
        formData.append("category", animalCategory);
        formData.append("image", fileRef.current.files[0]);

        try {
            const response = await axios.post('http://localhost:8000/api/addAnimal', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Animal added:', response.data);
            fetchAnimals()
            onClose();
            router.refresh()

        } catch (error) {
            console.error('Error adding animal:', error);
            toast.error("There was an error adding the animal.");
        }
    }; // ps: I can also use react-hook-form





    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-white w-[400px] p-6 rounded-[24px] shadow-lg relative">
                <h2 className="text-[18px] mb-4 ">Add Animal</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            id="animalName"
                            placeholder="Name"
                            className="w-full px-4 py-3 border border-white rounded-md bg-[#F2F2F2] outline-none mb-1"
                            autoComplete="off"
                            value={animalName}
                            onChange={(e) => setAnimalName(e.target.value)}
                        />
                        <select
                            id="animalCategory"
                            className="w-full px-4 py-3 border border-white rounded-md bg-[#F2F2F2] outline-none"
                            value={animalCategory}
                            onChange={(e) => setAnimalCategory(e.target.value)}
                        >
                            <option value="" disabled>Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <div>
                            <input
                                type="file"
                                id="uploadImage"
                                ref={fileRef}
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <div className="flex items-center border border-white rounded-md bg-[#F2F2F2] cursor-default">
                                <span className="flex-1 px-4 py-3">{fileName || "No file chosen"}</span>
                                <button
                                    onClick={handleUpload}
                                    type="button"
                                    className="bg-[#CCCCCC] text-black rounded-lg text-xs px-1 py-1 mr-1"
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="bg-black text-white px-4 py-3 rounded-md w-full">
                            Create Animal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
