import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase, Faq, FaqCategory } from '../lib/supabase';

interface FaqWithCategory extends Faq {
  category: FaqCategory | null;
}

export default function HelpCenterPage() {
  const [faqs, setFaqs] = useState<FaqWithCategory[]>([]);
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesResult, faqsResult] = await Promise.all([
        supabase
          .from('faq_categories')
          .select('*')
          .order('display_order', { ascending: true }),
        supabase
          .from('faqs')
          .select('*')
          .order('display_order', { ascending: true })
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (faqsResult.error) throw faqsResult.error;

      const categoriesData = categoriesResult.data || [];
      const faqsData = faqsResult.data || [];

      const faqsWithCategory = faqsData.map(faq => ({
        ...faq,
        category: categoriesData.find(cat => cat.id === faq.category_id) || null
      }));

      setCategories(categoriesData);
      setFaqs(faqsWithCategory);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = async (faqId: string) => {
    if (expandedFaqId === faqId) {
      setExpandedFaqId(null);
    } else {
      setExpandedFaqId(faqId);

      await supabase
        .from('faqs')
        .update({ view_count: faqs.find(f => f.id === faqId)!.view_count + 1 })
        .eq('id', faqId);
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || faq.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredFaqs = faqs.filter(faq => faq.is_featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-full mb-4">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Help Center</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How Can We Help You?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Search our knowledge base for answers to frequently asked questions about our training programs
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-lg"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All Topics
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {searchQuery === '' && selectedCategory === 'all' && featuredFaqs.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Popular Questions
                </h2>
              </div>
              <div className="grid gap-4">
                {featuredFaqs.map(faq => (
                  <div
                    key={faq.id}
                    className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-start justify-between gap-4 text-left"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                        {faq.question}
                      </h3>
                      {expandedFaqId === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                      )}
                    </button>
                    {expandedFaqId === faq.id && (
                      <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                        {faq.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {faq.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600 dark:text-gray-300">Loading FAQs...</div>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                No results found for "{searchQuery}"
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div>
              {(searchQuery !== '' || selectedCategory !== 'all') && (
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {searchQuery !== '' ? `Search Results (${filteredFaqs.length})` : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
              )}

              <div className="space-y-4">
                {categories
                  .filter(category =>
                    selectedCategory === 'all' || category.id === selectedCategory
                  )
                  .map(category => {
                    const categoryFaqs = filteredFaqs.filter(faq => faq.category_id === category.id);

                    if (categoryFaqs.length === 0) return null;

                    return (
                      <div key={category.id}>
                        {selectedCategory === 'all' && searchQuery === '' && (
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
                            {category.name}
                          </h3>
                        )}
                        <div className="space-y-3">
                          {categoryFaqs.map(faq => (
                            <div
                              key={faq.id}
                              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
                            >
                              <button
                                onClick={() => toggleFaq(faq.id)}
                                className="w-full flex items-start justify-between gap-4 text-left"
                              >
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                                  {faq.question}
                                </h4>
                                {expandedFaqId === faq.id ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                                )}
                              </button>
                              {expandedFaqId === faq.id && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {faq.answer}
                                  </p>
                                  {faq.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                      {faq.tags.map((tag, idx) => (
                                        <span
                                          key={idx}
                                          className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="mt-16 text-center bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
