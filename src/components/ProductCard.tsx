import React from 'react';
import { Product } from '../types';
import { formatINR } from '../utils/pricing';
import { Star, ShoppingCart, Zap, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  lang: 'en' | 'ta';
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onBuyNow: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  onSelect,
  onAddToCart,
  onBuyNow
}) => {
  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-md border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer overflow-hidden relative"
    >
      {/* Assured or BestSeller Tag */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
        {product.discountPercent > 0 && (
          <span className="bg-emerald-700 text-white text-[11px] font-black px-2 py-0.5 rounded shadow-sm">
            {product.discountPercent}% OFF
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-amber-500 text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
            ★ {lang === 'ta' ? 'அதிக விற்பனை' : 'Best Seller'}
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative aspect-3/4 overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Culture / Fabric badge */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
          {product.fabric}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Assured tag */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-medium text-gray-600 truncate">{product.categoryLabel}</span>
            {product.isAssured && (
              <span className="text-[11px] font-black italic text-[#2874f0] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                Aalayam<span className="text-yellow-600">✦Assured</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#2874f0] transition line-clamp-2 leading-snug">
            {lang === 'ta' ? product.tamilName || product.name : product.name}
          </h3>

          {/* Subtitle in other language */}
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
            {lang === 'ta' ? product.name : product.tamilName}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="inline-flex items-center gap-0.5 bg-emerald-700 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              {product.rating}
              <Star className="w-3 h-3 fill-white" />
            </span>
            <span className="text-xs text-gray-500">
              ({product.ratingCount.toLocaleString('en-IN')})
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-black text-gray-900">
              {formatINR(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {product.discountPercent}% off
                </span>
              </>
            )}
          </div>

          {/* Free Delivery note */}
          <div className="text-[11px] text-emerald-800 font-semibold mt-1">
            {lang === 'ta' ? 'இலவச டெலிவரி (Free Delivery)' : 'Free Delivery'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-gray-100">
          <button
            onClick={(e) => onAddToCart(product, e)}
            className="flex items-center justify-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xs font-bold py-2 px-2 rounded-sm transition cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{lang === 'ta' ? 'கூடையில் சேர்' : 'Add to Cart'}</span>
          </button>
          <button
            onClick={(e) => onBuyNow(product, e)}
            className="flex items-center justify-center gap-1.5 bg-[#fb641b] hover:bg-orange-600 text-white text-xs font-bold py-2 px-2 rounded-sm transition cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>{lang === 'ta' ? 'உடனே வாங்கு' : 'Buy Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
