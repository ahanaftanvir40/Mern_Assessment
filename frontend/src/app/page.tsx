'use client'
import { useState } from 'react';
import Image from 'next/image';
import AddAnimalModal from '@/app/components/modals/AddAnimalModal';
import AddCategoryModal from './components/modals/AddCategoryModal';
import axios from 'axios';
import { useEffect } from 'react';

interface Category {
  id: string;
  name: string;
}
interface Animal {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}



export default function Home() {
  const [activeModal, setActiveModal] = useState<null | 'addAnimal' | 'addCategory'>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('Land Animal');

  const handleOpenModal = (modal: 'addAnimal' | 'addCategory') => {
    setActiveModal(modal);
  };

  const handleCloseModal = () => {
    setActiveModal(null)
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    filterAnimalsByCategory(categoryName);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      setCategories(response.data);
      if (response.data.length > 0) {
        setActiveCategory(response.data[0].name);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAnimals = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/animals`)
      setAnimals(response.data);
      setFilteredAnimals(response.data.filter((animal: Animal) => animal.category === activeCategory));
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };


  useEffect(() => {
    fetchCategories();
    fetchAnimals();
  }, []);


  const filterAnimalsByCategory = (categoryName: string) => {
    const filtered = animals.filter((animal) => animal.category === categoryName);
    setFilteredAnimals(filtered);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-black">
      <div className="w-full max-w-7xl pl-10">
        <div id="categories" className="flex justify-between">
          <div className="flex gap-[24px] text-center">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`flex justify-center items-center pt-[14px] pr-[20px] pb-[14px] pl-[24px] border rounded-[100px] 
                ${activeCategory === category.name ? 'border-[#058F34] text-[#058F34] w-[146px] h-[46px]' : 'border-[#EF0D0D] text-[#EF0D0D] w-[100px] h-[46px]'}`}
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="flex gap-[24px] pr-20 ">
            <button
              onClick={() => handleOpenModal('addAnimal')}
              className="flex justify-center items-center pt-[14px] pr-[20px] pb-[14px] pl-[24px] border border-[#FFFFFF] rounded-[100px] text-[#FFFFFF] w-[140px] h-[46px]"
            >
              Add Animal
            </button>
            <button
              onClick={() => handleOpenModal('addCategory')}
              className="flex justify-center items-center pt-[14px] pr-[20px] pb-[14px] pl-[24px] border border-[#FFFFFF] rounded-[100px] text-[#FFFFFF] w-[164px] h-[46px]"
            >
              Add Category
            </button>
          </div>
        </div>

        <div id="Animals" className="flex flex-wrap items-center justify-start gap-10 py-16">
          {filteredAnimals.map((animal) => (
            <div key={animal.id} className="flex flex-col justify-center items-center">
              <div className="w-[160px] h-[191px] bg-[#050505] border border-[#141414] rounded-[8px]">
                <div className="w-full h-full flex items-center justify-center">
                  <Image src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${animal.imageUrl}`} alt={animal.name} width={100} height={100} />
                </div>
              </div>
              <div className="pt-2">
                <h1 className="text-white/80 font-normal">{animal.name}</h1>
              </div>
            </div>
          ))}
          {filteredAnimals.length === 0 && (
            <h1 className='text-white/80 text-2xl'>No Animals Found</h1>
          )}
        </div>

        {activeModal === 'addAnimal' && (
          <AddAnimalModal isOpen={activeModal === 'addAnimal'} onClose={handleCloseModal} categories={categories} fetchAnimals={fetchAnimals} />
        )}

        {activeModal === 'addCategory' && (
          <AddCategoryModal isOpen={activeModal === 'addCategory'} onClose={handleCloseModal} fetchCategories={fetchCategories} />
        )}
      </div>
    </div>
  );
}
