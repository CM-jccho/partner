import Link from "next/link";
import { Product } from "@/data/mock";
import { formatPrice } from "@/lib/utils";
import StarRating from "./StarRating";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
}

export default function ProductCard({ product, horizontal = false }: ProductCardProps) {
  if (horizontal) {
    return (
      <Link href={`/products/${product.id}`} className="block">
        <div className="w-36 flex-shrink-0 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="relative h-24 w-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="144px"
            />
            {product.discount > 0 && (
              <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {product.discount}%
              </span>
            )}
          </div>
          <div className="p-2.5">
            <p className="text-[10px] text-gray-400 font-medium">{product.brand}</p>
            <p className="text-xs text-gray-800 font-medium leading-tight mt-0.5 line-clamp-2">
              {product.name}
            </p>
            <div className="mt-1.5">
              {product.discount > 0 && (
                <p className="text-[10px] text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
              <p className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 430px) 50vw, 200px"
          />
          {product.discount > 0 && (
            <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {product.discount}%
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="text-[11px] text-gray-400 font-medium">{product.brand}</p>
          <p className="text-sm text-gray-800 font-semibold leading-tight mt-0.5 line-clamp-2">
            {product.name}
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            <StarRating rating={product.rating} size={11} />
            <span className="text-[10px] text-gray-400">({product.reviewCount.toLocaleString()})</span>
          </div>
          <div className="mt-1.5">
            {product.discount > 0 && (
              <p className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
            <p className="text-base font-bold text-gray-900">{formatPrice(product.price)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
