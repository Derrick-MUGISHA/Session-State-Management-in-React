import { useParams } from "react-router-dom";

export default function PropertyDetails() {
  const { id } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-neutral-800">Property Details for ID: {id}</h1>
      <p className="mt-2 text-sm text-neutral-600">Gallery, amenities, and booking widget will go here.</p>
    </div>
  );
}