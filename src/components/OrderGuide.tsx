const STEPS = [
  {
    number: '01.',
    title: 'Select Silhouette & Fit',
    description:
      'Choose from XS to XXL across our 16 women’s fashion categories, pick your preferred shade, and add pieces to your bag.',
  },
  {
    number: '02.',
    title: 'Enter Delivery Details',
    description:
      'Review your itemized bag summary and enter your name, phone, WhatsApp number, and complete delivery address.',
  },
  {
    number: '03.',
    title: 'Confirm on WhatsApp',
    description:
      'Tap Place Order via WhatsApp to launch a pre-filled order message directly to our atelier concierge for dispatch.',
  },
];

export function OrderGuide() {
  return (
    <section id="order-guide" className="py-12 sm:py-16 bg-[#FCFBF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.16em] text-[#7A5C30]">
            Personal Concierge
          </p>
          <h2 className="mt-1.5 font-serif text-3xl sm:text-4xl font-semibold text-[#1F1A17]">
            Seamless Ordering via WhatsApp
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#594E47] leading-relaxed">
            Enjoy direct boutique styling advice, custom tailoring notes, and cash-on-delivery coordination in three effortless steps.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border border-[#E7DDD2] bg-[#F5EFE8] p-6"
            >
              <p className="font-serif text-2xl font-semibold text-[#9A7845] tabular-nums">
                {step.number}
              </p>
              <h3 className="mt-2 font-serif text-xl font-semibold text-[#1F1A17]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-[#594E47] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
