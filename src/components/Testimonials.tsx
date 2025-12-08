import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useLanguage, translations } from "@/hooks/use-language.ts";

export default function Testimonials() {
  const testimonials = useQuery(api.testimonials.getFeatured);
  const { language } = useLanguage();
  const t = translations[language];

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{t.testimonialsTitle}</h2>
          <p className="text-muted-foreground text-lg">
            {t.testimonialsDesc}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial._id} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  {testimonial.customerImage ? (
                    <img
                      src={testimonial.customerImage}
                      alt={testimonial.customerName}
                      loading="lazy"
                      decoding="async"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">
                        {testimonial.customerName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold">{testimonial.customerName}</h4>
                    {testimonial.customerRole && (
                      <p className="text-sm text-muted-foreground">
                        {testimonial.customerRole}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  "{testimonial.testimonial}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
