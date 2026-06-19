const footerColumns = [
  { title: "Support", links: ["Help Center", "Cancellation options", "Safety resource center", "Contact us"] },
  { title: "Discover", links: ["Loyalty program", "Seasonal deals", "Travel articles", "For Business"] },
  { title: "Terms & settings", links: ["Privacy & cookies", "Terms & conditions", "Grievance redressal"] },
  { title: "Partners", links: ["List your property", "Partner help", "Affiliate program"] },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold text-neutral-800">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-neutral-600 hover:text-brand-navy hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-6 sm:flex-row">
          <div className="flex items-center gap-2 text-lg font-extrabold text-brand-navy">
            <span className="text-brand-yellow">Booking</span>
            <span>.Com</span>
          </div>
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} Booking.Com. A learning project, not affiliated with Booking.com.
          </p>
        </div>
      </div>
    </footer>
  );
}