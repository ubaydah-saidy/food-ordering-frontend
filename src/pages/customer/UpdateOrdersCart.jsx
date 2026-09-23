import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { restaurantService } from '../../services/restaurantService';

export const UpdateOrdersCart = ({ onProceedToBills, onNavigateToOrders }) => {
  const { cartItems, addToCart, removeFromCart, updateQuantity, totalCount, totalAmount } = useCart();
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadFoods = () => {
    const list = restaurantService.getFoods(null, searchQuery);
    setFoods(list);
  };

  useEffect(() => {
    loadFoods();
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      
      {/* Top Banner Matching Sketch Page 5: "Updates my orders:" */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              Updates my orders:
            </h2>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mt-1">
              <button 
                onClick={onNavigateToOrders}
                className="hover:text-amber-600 transition flex items-center gap-1"
              >
                <span>→ My orders</span>
              </button>
              <span>•</span>
              <span className="text-amber-600">→ Changes orders & Carts</span>
            </div>
          </div>

          {/* Search Foods bar matching sketch Page 5 */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Food Cards Grid with "add cart" buttons (Matching Sketch Page 5 middle) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Chagua Vyakula vya Kuongeza (Add foods to cart):
          </h3>
          <span className="text-xs text-slate-400">{foods.length} vyakula vinapatikana</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {foods.slice(0, 6).map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-col justify-between hover:border-amber-400 transition shadow-sm"
            >
              <div className="flex gap-3">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                    {food.category}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    {food.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {food.description}
                  </p>
                  <span className="font-black text-xs text-slate-900 block mt-1">
                    TSh {food.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Button explicitly written as "add cart" as in Page 5 sketch */}
              <button
                onClick={() => addToCart(food, 1)}
                className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-800 text-xs font-bold border border-amber-200 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>add cart</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dedicated Section Matching Sketch Page 5 Bottom: "Carts:" */}
      <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-md space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                Carts:
              </h3>
              <p className="text-[11px] text-slate-500">
                Orodha ya vyakula vilivyomo ndani ya kikapu chako
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {totalCount} Items
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-500 text-xs font-medium">
              Kikapu chako kiko tupu. Chagua vyakula hapo juu na ubonyeze "add cart".
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* List of Cart Items */}
            <div className="divide-y divide-slate-100">
              {cartItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-slate-500">
                        TSh {item.price.toLocaleString()} kila kimoja
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Action Controls */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center transition shadow-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center transition shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-black text-slate-900 text-sm w-24 text-right">
                      TSh {(item.price * item.quantity).toLocaleString()}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 transition"
                      title="Ondoa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Calculation & Proceed to Payment */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 block">Jumla Ndogo (Subtotal):</span>
                <span className="text-2xl font-black text-slate-900">
                  TSh {totalAmount.toLocaleString()}
                </span>
              </div>

              <button
                onClick={onProceedToBills}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-sm shadow-lg shadow-amber-500/25 transition"
              >
                <span>Nenda Kwenye Malipo (My Bills)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
