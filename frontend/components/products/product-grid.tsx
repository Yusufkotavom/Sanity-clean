"use client";

import ProductCard from "@/components/ui/product-card";
import LoadMoreGrid from "@/components/ui/load-more-grid";

type ProductGridProps = {
  products: any[];
  initialCount?: number;
  step?: number;
};

export default function ProductGrid({
  products,
  initialCount = 16,
  step = 16,
}: ProductGridProps) {
  return (
    <LoadMoreGrid
      items={products}
      initialCount={initialCount}
      step={step}
      gridClassName="grid grid-cols-2 gap-4 lg:grid-cols-4"
      buttonLabel="Show more products"
      getKey={(product: any) => product.slug?.current || product.title}
      renderItem={(product: any, index: number) => <ProductCard {...product} priority={index < 2} />}
    />
  );
}
