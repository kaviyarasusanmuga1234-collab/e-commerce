import React from 'react';
import { Sparkles, Layers, Shirt, Crown, Gift, Tag } from 'lucide-react';

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  lang: 'en' | 'ta';
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  lang
}) => {
  const categories = [
    {
      id: 'all',
      name: 'All Indian Wear',
      tamilName: 'அனைத்து ஆடைகள்',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />
    },
    {
      id: 'silk-sarees',
      name: 'Pure Silk Sarees',
      tamilName: 'பட்டுச் சேலைகள்',
      icon: <Crown className="w-5 h-5 text-purple-600" />
    },
    {
      id: 'sarees',
      name: 'Designer & Cotton Sarees',
      tamilName: 'புடவை வகைகள்',
      icon: <Layers className="w-5 h-5 text-rose-500" />
    },
    {
      id: 'chudidhars',
      name: 'Chudidhar Sets',
      tamilName: 'சுடிதார் செட்ஸ்',
      icon: <Shirt className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'kurtis',
      name: 'Kurtis & Suits',
      tamilName: 'குர்த்திகள்',
      icon: <Gift className="w-5 h-5 text-emerald-600" />
    },
    {
      id: 'lehengas',
      name: 'Bridal Lehengas',
      tamilName: 'மணப்பெண் லெஹங்கா',
      icon: <Tag className="w-5 h-5 text-amber-600" />
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-xs">
      <div className="container mx-auto px-4 overflow-x-auto scrollbar-none py-3">
        <div className="flex items-center justify-start md:justify-center gap-6 md:gap-12 min-w-max">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center gap-1.5 group cursor-pointer transition text-center px-2 py-1 rounded ${
                  isSelected ? 'text-[#2874f0] font-bold' : 'text-gray-700 hover:text-[#2874f0]'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
                    isSelected ? 'bg-blue-100 ring-2 ring-[#2874f0]' : 'bg-gray-100 group-hover:bg-blue-50'
                  }`}
                >
                  {cat.icon}
                </div>
                <span className="text-xs font-semibold whitespace-nowrap">
                  {lang === 'ta' ? cat.tamilName : cat.name}
                </span>
                {isSelected && <span className="h-0.5 w-6 bg-[#2874f0] rounded-full"></span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
