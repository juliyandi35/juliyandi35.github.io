import { identity, disclaimer } from "@/lib/content";

export default function Contact() {
  return (
    <>
      <section id="contact" aria-labelledby="contact-heading" className="bg-ink py-20 text-paper sm:py-28">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="font-mono-label text-xs text-porcelain/60">Contact</p>
            <h2 id="contact-heading" className="mt-3 text-3xl font-medium sm:text-4xl">
              Open to discussing research, data, AI, or information systems work.
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ContactLink label="Email" value={identity.email} href={`mailto:${identity.email}`} />
            <ContactLink label="Phone" value={identity.phone} href={`tel:${identity.phone.replace(/\s+/g, "")}`} />
            <ContactLink label="LinkedIn" value="juli-yandi-rahman" href={identity.linkedin} external />
            <ContactLink label="GitHub" value={identity.githubHandle} href={identity.github} external />
          </div>
        </div>
      </section>
      <footer className="bg-ink pb-10">
        <div className="container-editorial border-t border-paper/15 pt-6">
          <p className="text-xs leading-relaxed text-porcelain/50">{disclaimer}</p>
        </div>
      </footer>
    </>
  );
}

function ContactLink({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex min-h-[44px] flex-col justify-center gap-1 rounded-surface border border-paper/15 px-5 py-4 transition-colors duration-200 hover:border-oxide"
    >
      <span className="font-mono-label text-[10px] text-porcelain/50">{label}</span>
      <span className="text-sm text-paper">{value}</span>
    </a>
  );
}
