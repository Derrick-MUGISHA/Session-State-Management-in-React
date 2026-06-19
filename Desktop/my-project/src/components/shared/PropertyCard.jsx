import { Link } from "react-router-dom";
import { useState } from "react";

export default function PropertyCard({ property }) {
  const { id, name, location, category, pricePerNight, rating, image } = property;
  const [saved, setSaved] = useState(false);

  function handleSaveClick(e) {
    e.preventDefault(); // stop the Link navigation from firing
    e.stopPropagation();
    setSaved((prev) => !prev);
  }

  return (
    <Link
      to={`/property/${id}`}
      className="group block overflow-hidden rounded-lg border border-neutral-200 transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <button
          type="button"
          onClick={handleSaveClick}
          aria-label={saved ? "Remove from saved" : "Save property"}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={saved ? "#febb02" : "none"}
            stroke={saved ? "#febb02" : "#595959"}
            strokeWidth={2}
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-neutral-800 shadow-sm">
          {category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-neutral-800">{name}</h3>
        <p className="text-sm text-neutral-600">{location}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="rounded-md bg-brand-navy px-2 py-1 text-xs font-bold text-white">
            {rating} ★
          </span>
          <p className="text-sm font-semibold text-neutral-800">
            ${pricePerNight} <span className="text-xs font-normal text-neutral-600">/ night</span>
          </p>
        </div>
      </div>
    </Link>
  );
}