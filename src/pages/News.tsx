import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Eye, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Article = Tables<"articles">;

const News = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .not("published_at", "is", null)
        .order("published_at", { ascending: false });

      if (error) throw error;
      
      // Debug logging
      console.log('📰 Total articles:', data?.length);
      data?.forEach((article, i) => {
        console.log(`${i + 1}. ${article.title.substring(0, 40)}...`);
        console.log(`   Image: ${article.cover_image_url ? '✅ ' + article.cover_image_url : '❌ NO IMAGE'}`);
      });
      
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-br from-accent to-primary text-primary-foreground py-16 px-4">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Newspaper className="h-12 w-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Noticias</h1>
            </div>
            <p className="text-lg opacity-90">
              Las últimas novedades del Mundial 2026
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            {loading ? (
              <div className="text-center">
                <p className="text-muted-foreground">Cargando noticias...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center">
                <Newspaper className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  No hay noticias publicadas en este momento
                </p>
                <p className="text-sm text-muted-foreground">
                  Mantente atento para las últimas actualizaciones del Mundial 2026
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Card
                    key={article.id}
                    className="group hover:shadow-lg transition-all hover:scale-[1.02] flex flex-col"
                  >
                    {article.cover_image_url ? (
                      <div className="h-48 overflow-hidden rounded-t-lg bg-muted">
                        <img
                          src={article.cover_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            console.error('❌ Error loading image:', article.cover_image_url);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="h-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary/50"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg></div>';
                          }}
                          onLoad={() => console.log('✅ Image loaded:', article.cover_image_url)}
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center">
                        <Newspaper className="h-16 w-16 text-primary/50" />
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        {article.published_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(new Date(article.published_at), "PPP", { locale: es })}
                            </span>
                          </div>
                        )}
                        {article.views !== null && article.views > 0 && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{article.views} vistas</span>
                          </div>
                        )}
                      </div>
                      
                      <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                      
                      {article.excerpt && (
                        <CardDescription className="line-clamp-3">
                          {article.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="mt-auto">
                      <div className="flex items-center justify-between">
                        {article.category && (
                          <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            {article.category}
                          </span>
                        )}
                        <Link to={`/news/${article.slug}`}>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            Leer más →
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default News;
