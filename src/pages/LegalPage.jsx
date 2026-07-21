import { Link } from 'react-router-dom';

const sections = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: July 21, 2026',
    intro: 'KR Mini Party Hall respects your privacy. This policy explains how we collect, use, and protect information when you visit our website or make an enquiry or booking.',
    items: [
      ['Information we collect', 'We may collect your name, phone number, email address, event details, preferred date, guest count, address, and any special requirements you provide through our booking form or when contacting us.'],
      ['How we use your information', 'We use this information to respond to enquiries, check availability, manage bookings, process payments where applicable, improve our services, and communicate important booking updates.'],
      ['Sharing and security', 'We do not sell your personal information. We may share it only with trusted service providers when needed to deliver your event or comply with legal obligations. We use reasonable safeguards to protect the information we hold.'],
      ['Your choices', 'You may request access to, correction of, or deletion of your personal information, subject to applicable legal and booking-record requirements.'],
      ['Contact us', 'For privacy-related questions, email krminipartyhall@gmail.com or contact us at Pozhichalur Main Road, Pammal, Chennai 600075.'],
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    updated: 'Last updated: July 21, 2026',
    intro: 'These terms apply to enquiries, bookings, and use of the KR Mini Party Hall website. By submitting an enquiry or confirming a booking, you agree to these terms.',
    items: [
      ['Bookings and confirmation', 'A booking is confirmed only after KR Mini Party Hall confirms availability and receives the required advance payment. Dates are held subject to availability until confirmation is provided.'],
      ['Payments and cancellations', 'Advance payments, balance-payment schedules, cancellation charges, and refunds are governed by the booking confirmation or agreement issued for your event. Please review these details before making a payment.'],
      ['Event responsibilities', 'The customer is responsible for providing accurate event details, complying with venue rules, obtaining any required permissions, and ensuring guests, vendors, and decorators act safely and respectfully on the premises.'],
      ['Venue use', 'Any damage to the venue, fixtures, or equipment caused by the customer, guests, or vendors may be charged to the customer. KR Mini Party Hall may refuse activities that are unsafe, unlawful, or inconsistent with venue policies.'],
      ['Website information', 'We aim to keep website content accurate, but hall availability, prices, packages, photographs, and services may change. A website enquiry does not create a confirmed reservation.'],
      ['Contact us', 'For questions about these terms, contact KR Mini Party Hall at krminipartyhall@gmail.com or Pozhichalur Main Road, Pammal, Chennai 600075.'],
    ],
  },
};

const LegalPage = ({ type }) => {
  const page = sections[type];

  return (
    <section className="bg-secondary min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-primary/15 p-7 sm:p-10">
          <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-3">KR Mini Party Hall</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">{page.title}</h1>
          <p className="text-gray-500 text-sm mb-8">{page.updated}</p>
          <p className="text-gray-700 leading-relaxed mb-10">{page.intro}</p>
          <div className="space-y-8">
            {page.items.map(([heading, content]) => (
              <article key={heading}>
                <h2 className="text-2xl font-semibold mb-2">{heading}</h2>
                <p className="text-gray-700 leading-relaxed">{content}</p>
              </article>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-10 pt-6">
            <Link to="/" className="text-primary font-semibold hover:text-accent transition-colors">← Back to home</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalPage;