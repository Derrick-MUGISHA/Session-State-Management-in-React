import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/shared/PropertyCard";
import properties from "../data/properties.json";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "Hotels";
  const destination = searchParams.get("destination") || "";

  const filtered = properties.filter((p) => {
    const matchType = p.category?.toLowerCase() === type.toLowerCase();
    const matchDest = destination
      ? p.location?.toLowerCase().includes(destination.toLowerCase())
      : true;
    return matchType && matchDest;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-neutral-800">
        {type} {destination ? `in ${destination}` : ""}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        {filtered.length} propert{filtered.length === 1 ? "y" : "ies"} found
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.length > 0 ? (
          filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <p className="col-span-4 text-sm text-neutral-500">
            No {type} found{destination ? ` in "${destination}"` : ""}.
          </p>
        )}
      </div>
    </div>
  );
}