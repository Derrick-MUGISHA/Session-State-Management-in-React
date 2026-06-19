import { useState } from "react";
import Hero from "../components/home/Hero";
import PropertyCard from "../components/shared/PropertyCard";
import properties from "../data/properties.json";

export default function Home() {
  const [activeType, setActiveType] = useState("Hotels");

const filtered = properties.filter(
  (p) => p.category?.toLowerCase() === activeType.toLowerCase()
);

  return (
    <div>
      <Hero activeType={activeType} setActiveType={setActiveType} />
      <div className="pt-16 sm:pt-12">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-neutral-800 sm:text-2xl">
            Featured {activeType}
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Hand-picked places across all categories
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.length > 0 ? (
              filtered.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <p className="col-span-4 text-sm text-neutral-500">
                No {activeType} available right now.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}