import React, { useState, useEffect } from 'react';
import { Search, Plus, Check, Sparkles, Filter, Clock, Flame, Utensils } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { restaurantService } from '../../services/restaurantService';
import { AnnouncementsBanner } from '../../components/AnnouncementsBanner';

export const CustomerDashboard = ({ onNavigateToCart }) => {
  const [foods, setFoods] = useState([]);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState({});

  const { addToCart } = useCart();

  const loadFoods = () => {
    setLoading(true);
    const data = restaurantService.getFoods(category, searchQuery);
    setFoods(data);
    setLoading(false);
  };

  useEffect(() => {
    loadFoods();
    const handleUpdate = () => loadFoods();
    window.addEventListener('restaurant_db_updated', handleUpdate);
    return () => window.removeEventListener('restaurant_db_updated', handleUpdate);
  }, [category, searchQuery]);

  const handleAdd = (food) => {
    addToCart(food, 1);
    setAddedIds(prev => ({ ...prev, [food.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [food.id]: false }));
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white p-6 sm:p-8 shadow-xl shadow-amber-500/15">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur text-white border border-white/30">
            <Flame className="w-3.5 h-3.5 text-amber-200" /> ODA CHAKULA MOTO SASA
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Karibu OUR RESTAURANT!
          </h2>
          <p className="text-amber-50 text-sm sm:text-base leading-relaxed">
            Agiza vyakula vitamu, snacks na vinywaji baridi. Malipo ya haraka kwa M-Pesa, TigoPesa au Kadi, na tutakuletea papo hapo ulipo kwa GPS!
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-15 translate-x-8 translate-y-8 pointer-events-none">
          <Sparkles className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Admin Announcements Banner (Matangazo ya Admin) */}
      <AnnouncementsBanner />

      {/* Sketch Page 3: Search Bar and Category Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Category Pills matching Page 3: [Snacks] [Foods] [Drinks] */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Snacks', 'Foods', 'Drinks'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 ${
                category === cat
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-500'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'Zote (All)' : cat}
            </button>
          ))}
        </div>

        {/* Search Bar matching sketch: "Q Search" */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tafuta chakula, vinywaji, snacks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-slate-50 focus:bg-white transition"
          />
        </div>

      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4">
              <div className="h-44 bg-slate-200 rounded-xl"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="h-8 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : foods.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">Hakuna chakula kilichopatikana kwa utafutaji wako.</p>
          <button 
            onClick={() => { setCategory('All'); setSearchQuery(''); }}
            className="mt-3 text-xs font-bold text-amber-600 hover:underline"
          >
            Angalia menu yote
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map((food) => {
            const isAdded = addedIds[food.id];
            return (
              <div
                key={food.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden food-card-shadow transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase bg-white/90 backdrop-blur text-slate-800 shadow-sm">
                        {food.category}
                      </span>
                    </div>
                    {food.available === false && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider">
                        Kimekwisha (Out of Stock)
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-amber-600 transition line-clamp-1">
                      {food.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {food.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">BEI</span>
                      <span className="text-base font-extrabold text-slate-900">
                        TSh {food.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAdd(food)}
                      disabled={food.available === false}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        isAdded
                          ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20 active:scale-95'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Imeongezwa!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Add to cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
