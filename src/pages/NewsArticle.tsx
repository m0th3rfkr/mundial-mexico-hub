import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Eye, ArrowLeft, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

type Article = Tables<"articles">;

const NewsArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      
      // Incrementar views
      if (data) {
        await supabase
          .from("articles")
          .update({ views: (data.views || 0) + 1 })
          .eq("id", data.id);
      }
      
      setArticle(data);
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando noticia...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Noticia no encontrada</h2>
            <Link to="/news">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Noticias
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-6">
          <Link to="/news">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Noticias
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        {article.cover_image_url && (
          <div className="w-full h-[400px] overflow-hidden bg-muted">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Article Content */}
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Category */}
          {article.category && (
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {article.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
            {article.author && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {article.author}
                </span>
              </div>
            )}
            
            {article.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(article.published_at), "PPP", { locale: es })}
                </span>
              </div>
            )}
            
            {article.views !== null && (
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{article.views} vistas</span>
              </div>
            )}
          </div>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed">
              {article.content}
            </p>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-sm font-medium mb-3">Etiquetas:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-muted text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-8 pt-8 border-t">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default NewsArticle;
