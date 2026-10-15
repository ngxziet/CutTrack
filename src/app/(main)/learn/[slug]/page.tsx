import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck, AlertTriangle, BookOpen, HelpCircle } from "lucide-react";
import { ARTICLES_DATA } from "@/features/learn/data/articles";

export async function generateStaticParams() {
  return ARTICLES_DATA.map((a) => ({ slug: a.slug }));
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES_DATA.find((a) => a.slug === slug);
  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Thư viện kiến thức
        </Link>
      </div>

      {/* Hero Cover 16:9 */}
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-border bg-secondary shadow-sm">
        <img
          src={article.coverUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-background/90 backdrop-blur-md border border-border text-foreground">
            {article.categoryTag}
          </span>
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" /> {article.readTime}
          </span>
          <span>•</span>
          <span>Cập nhật ngày {article.updatedAt}</span>
          <span>•</span>
          <span>{article.author}</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-foreground leading-tight">
          {article.title}
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          {article.subtitle}
        </p>
      </div>

      {/* Key Takeaways Box */}
      <div className="p-5 rounded-3xl border border-primary/20 bg-primary/5 space-y-2">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" /> Tóm Tắt & Kết Luận Cốt Lõi
        </h3>
        <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
          {article.keyTakeaways.map((item, idx) => (
            <li key={idx} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      </div>

      {/* Sections Content */}
      <div className="space-y-6 pt-2">
        {article.sections.map((section, idx) => (
          <div key={idx} className="p-6 rounded-3xl border border-border bg-card space-y-3">
            <h2 className="text-xl font-bold text-foreground">
              {section.heading}
            </h2>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line space-y-2">
              {section.content}
            </div>

            {section.callout && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold mb-0.5">{section.callout.title}</strong>
                  <span>{section.callout.text}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FAQs Section */}
      {article.faqs && article.faqs.length > 0 && (
        <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" /> Câu Hỏi Thường Gặp (FAQs)
          </h3>
          <div className="space-y-3">
            {article.faqs.map((faq, i) => (
              <div key={i} className="p-4 rounded-2xl bg-secondary/40 border border-border/50 text-xs space-y-1">
                <span className="font-bold text-sm text-foreground block">{faq.question}</span>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scientific References */}
      {article.references && article.references.length > 0 && (
        <div className="p-5 rounded-2xl border border-border bg-secondary/30 text-xs space-y-2">
          <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block">
            Tài liệu tham khảo khoa học
          </span>
          <ul className="space-y-1 text-muted-foreground">
            {article.references.map((ref, i) => (
              <li key={i}>• {ref.title} — <em>{ref.source}</em> {ref.year ? `(${ref.year})` : ""}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
