import React, { useState, useEffect } from 'react';
import { Utensils, Search, Plus, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { restaurantService } from '../../services/restaurantService';

export const FoodsDrinksSnacks = () => {
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [addedMap, setAddedMap] = useState({});

  const { addToCart } = useCart();

  const loadFoods = () => {
    const list = restaurantService.getFoods(selectedCategory, search);
    setFoods(list);
  };

  useEffect(() => {
    loadFoods();
  }, [selectedCategory, search]);

  const handleAdd = (item) => {
    addToCart(item, 1);
    setAddedMap(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <Utensils className="w-6 h-6 text-amber-500" />
            <span>Foods & Drinks & Snacks</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Orodha kamili ya vyakula, vitafunwa na vinywaji vyote vya mgahawa wetu.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tafuta kwenye menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['All', 'Foods', 'Snacks', 'Drinks'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {cat === 'All' ? 'Onyesha Vyote' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {foods.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
          Hakuna bidhaa inayolingana na utafutaji wako.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {foods.map((item) => {
            const isAdded = addedMap[item.id];
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-amber-400 transition group"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wide bg-white/95 text-slate-800 shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">BEI</span>
                      <span className="text-sm font-black text-slate-900">
                        TSh {item.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAdd(item)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                        isAdded 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95'
                      }`}
                    >
                      {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{isAdded ? 'Ipo Cart!' : 'Add to cart'}</span>
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
