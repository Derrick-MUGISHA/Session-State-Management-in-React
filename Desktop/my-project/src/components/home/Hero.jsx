import { useNavigate } from "react-router-dom";

const propertyTypes = ["Hotels", "Apartments", "Resorts", "Villas"];

export default function Hero({ activeType, setActiveType }) {
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    const destination = e.target.destination.value;
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    params.set("type", activeType);
    navigate(`/search?${params.toString()}`);
  }

  return (
    <section className="relative bg-brand-navy pb-24 pt-10 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
          Find your next stay
        </h1>
        <p className="mt-2 text-sm text-white/80 sm:text-base">
          Search hotels, apartments, resorts, and villas — all in one place.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {propertyTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              className={`rounded-t-md px-4 py-2 text-sm font-semibold transition-colors ${
                activeType === type
                  ? "bg-white text-brand-navy"
                  : "bg-brand-navy text-white hover:bg-white/10"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSearch}
          className="absolute left-0 right-0 top-[calc(100%-3rem)] z-10 mx-4 grid gap-3 rounded-lg bg-white p-4 shadow-xl sm:mx-6 sm:grid-cols-2 lg:mx-auto lg:max-w-7xl lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-neutral-200 lg:rounded-md lg:p-0"
        >
          <label className="flex flex-col gap-1 p-2 lg:p-4">
            <span className="text-xs font-semibold text-neutral-600">Destination</span>
            <input
              type="text"
              name="destination"
              placeholder="Where are you going?"
              className="rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 lg:border-none lg:p-0 lg:focus:ring-0"
            />
          </label>

          <label className="flex flex-col gap-1 p-2 lg:p-4">
            <span className="text-xs font-semibold text-neutral-600">Check-in — Check-out</span>
            <input type="text" placeholder="Add dates" readOnly className="cursor-pointer rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none lg:border-none lg:p-0" />
          </label>

          <label className="flex flex-col gap-1 p-2 lg:p-4">
            <span className="text-xs font-semibold text-neutral-600">Guests</span>
            <input type="text" placeholder="2 adults · 0 children" readOnly className="cursor-pointer rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none lg:border-none lg:p-0" />
          </label>

          <div className="flex items-center p-2 lg:p-4">
            <button type="submit" className="w-full rounded-md bg-brand-yellow px-4 py-3 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-yellow-dark lg:py-2">
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}