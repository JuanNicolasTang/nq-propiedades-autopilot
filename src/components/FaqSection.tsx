import { HelpCircle } from "lucide-react";

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqSection({
  eyebrow = "Preguntas frecuentes",
  faqs,
  title,
}: {
  eyebrow?: string;
  faqs: FaqItem[];
  title: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">{eyebrow}</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink">
            {title}
          </h2>
        </div>
        <div className="grid gap-3">
          {faqs.map((faq) => (
            <article className="rounded-soft border border-ink/10 bg-white p-5" key={faq.question}>
              <div className="flex items-start gap-3">
                <HelpCircle aria-hidden="true" className="mt-1 shrink-0 text-jade" size={20} />
                <div>
                  <h3 className="text-lg font-semibold text-ink">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/68">{faq.answer}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
