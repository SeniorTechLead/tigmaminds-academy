import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Tag, ArrowLeft, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase, BlogPost } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setBlog(data);

        await supabase
          .from('blog_posts')
          .update({ view_count: data.view_count + 1 })
          .eq('id', data.id);

        fetchRelatedBlogs(data.category, data.id);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (category: string | null, currentBlogId: string) => {
    if (!category) return;

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .eq('category', category)
        .neq('id', currentBlogId)
        .limit(3)
        .order('published_at', { ascending: false });

      if (error) throw error;

      setRelatedBlogs(data || []);
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-lg text-gray-600 dark:text-gray-300">Loading article...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">The article you're looking for doesn't exist.</p>
            <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      <article className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to All Articles
          </Link>

          {blog.category && (
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-semibold mb-4">
              {blog.category}
            </div>
          )}

          <h1
            className="text-4xl sm:text-5xl font-bold mb-6 leading-tight"
            style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}
          >
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{blog.author_name}</div>
                {blog.author_title && (
                  <div className="text-sm">{blog.author_title}</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(blog.published_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{blog.read_time_minutes} min read</span>
            </div>
          </div>

          <div className="prose prose-xl prose-gray dark:prose-invert max-w-none mb-12
            prose-headings:font-bold
            prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-10
            prose-h2:text-[2rem] prose-h2:leading-tight prose-h2:mb-6 prose-h2:mt-12
            prose-h3:text-[1.75rem] prose-h3:leading-tight prose-h3:mb-6 prose-h3:mt-10 prose-h3:font-extrabold
            prose-p:text-[1.3rem] prose-p:leading-[1.7] prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:mb-8
            prose-ul:my-8 prose-ul:space-y-4 prose-ul:ml-8 prose-ul:list-disc
            prose-li:text-[1.3rem] prose-li:leading-[1.7] prose-li:text-gray-800 dark:prose-li:text-gray-200 prose-li:pl-3 prose-li:marker:text-gray-800 dark:prose-li:marker:text-gray-200
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
            prose-code:text-gray-900 dark:prose-code:text-gray-100 prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:shadow-lg
            prose-img:hidden">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              components={{
                img: () => null,
                p: ({children}) => <p className="mb-6 text-gray-800 dark:text-gray-200">{children}</p>,
                ul: ({children}) => <ul className="my-6 space-y-3 list-disc pl-8 text-gray-800 dark:text-gray-200">{children}</ul>,
                li: ({children}) => <li className="pl-2 text-gray-800 dark:text-gray-200">{children}</li>,
                h2: ({children}) => <h2 className="bg-yellow-200 dark:bg-yellow-900/30 px-4 py-2 rounded-lg -mx-4" style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}>{children}</h2>,
                h3: ({children}) => <h3 className="bg-blue-100 dark:bg-blue-900/20 px-4 py-2 rounded-lg -mx-4" style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}>{children}</h3>,
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>

          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b border-gray-200 dark:border-gray-700">
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Your Tech Journey?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Join TigmaMinds Academy and learn from industry experts through our comprehensive, mentor-led training programs.
            </p>
            <Link
              to="/students"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Apply Now
            </Link>
          </div>

          {relatedBlogs.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Articles</h3>
              <div className="grid gap-6">
                {relatedBlogs.map(relatedBlog => (
                  <Link
                    key={relatedBlog.id}
                    to={`/blog/${relatedBlog.slug}`}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                  >
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {relatedBlog.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{relatedBlog.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{formatDate(relatedBlog.published_at)}</span>
                      <span>•</span>
                      <span>{relatedBlog.read_time_minutes} min read</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}
