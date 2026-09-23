import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { restaurantService } from '../../services/restaurantService';

export const MyBills = ({ onOrderSuccess, onCancel }) => {
  const { user, detectedLocation } = useAuth();
  const { cartItems, totalAmount, clearCart, checkoutOrder, setCheckoutOrder } = useCart();

  // Payment method selection
  const [methodType, setMethodType] = useState('mobile');
  const [mobileNetwork, setMobileNetwork] = useState('Vodacom M-Pesa');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone?.replace('+255', '').trim() || '712345678');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');

  // Transaction fee calculation
  const currentBill = checkoutOrder ? checkoutOrder.billAmount : totalAmount;
  const [fees, setFees] = useState({ bill: currentBill || 0, fee: 400, total: (currentBill || 0) + 400 });
  
  // Processing dialog states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate fee directly from service
  useEffect(() => {
    const activeMethod = methodType === 'mobile' ? mobileNetwork : 'Visa/Mastercard';
    const calculated = restaurantService.calculateFee(activeMethod, currentBill);
    setFees({
      bill: calculated.billAmount,
      fee: calculated.transactionFee,
      total: calculated.totalAmount
    });
  }, [methodType, mobileNetwork, currentBill]);

  const handlePayNow = async () => {
    if (currentBill <= 0) {
      setErrorMsg('Huna bili ya kulipia. Tafadhali weka chakula kwenye Carts kwanza.');
      return;
    }

    if (methodType === 'mobile' && (!phoneNumber || phoneNumber.length < 9)) {
      setErrorMsg('Tafadhali weka namba sahihi ya simu ya kulipia.');
      return;
    }

    if (methodType === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      setErrorMsg('Tafadhali kamilisha taarifa zote za kadi ya benki.');
      return;
    }

    setErrorMsg('');
    setIsProcessing(true);

    const activeMethod = methodType === 'mobile' ? mobileNetwork : 'Visa / Mastercard (Kadi ya Benki)';
    const paymentContact = methodType === 'mobile' ? `+255 ${phoneNumber}` : `Kadi: •••• ${cardNumber.slice(-4)}`;

    try {
      // Step 1: Simulated Push notification
      setProcessStep(methodType === 'mobile' 
        ? `Inatuma ujumbe wa malipo kwenye namba +255 ${phoneNumber} (${mobileNetwork})...` 
        : 'Inathibitisha kadi yako ya benki na mfumo wa malipo...'
      );
      await new Promise(r => setTimeout(r, 1200));

      // Step 2: Simulated PIN / authorization
      setProcessStep('Malipo yamepokelewa na yanathibitishwa na benki...');
      await new Promise(r => setTimeout(r, 1200));

      // Step 3: Create order in service with verified ACTIVE CUSTOMER LOCATION
      const itemsToOrder = checkoutOrder ? checkoutOrder.items : cartItems;
      const orderPayload = {
        customer: {
          id: user?.id || `cust-${Date.now()}`,
          username: user?.username || 'customer',
          fullName: user?.fullName || 'Valued Customer',
          phone: user?.phone || `+255 ${phoneNumber}`,
          email: user?.email || '',
          address: detectedLocation.address || 'Kariakoo, Dar es Salaam',
          coords: detectedLocation.coords || { lat: -6.8185, lng: 39.2745 },
          activeLocation: {
            address: detectedLocation.address || 'Dar es Salaam, Tanzania',
            coords: detectedLocation.coords || { lat: -6.8185, lng: 39.2745 },
            accuracy: detectedLocation.accuracy ? `±${detectedLocation.accuracy}m` : 'GPS Verified',
            detectedAt: new Date().toLocaleTimeString(),
            isLiveActive: true
          }
        },
        items: itemsToOrder,
        billAmount: fees.bill,
        transactionFee: fees.fee,
        totalAmount: fees.total,
        paymentMethod: activeMethod,
        paymentPhoneOrCard: paymentContact
      };

      const res = restaurantService.createOrder(orderPayload);
      if (!res.success) {
        throw new Error(res.error || 'Imeshindwa kukamilisha oda.');
      }

      setIsProcessing(false);
      setPaymentSuccessData(res.order);
      clearCart();
      if (setCheckoutOrder) setCheckoutOrder(null);

    } catch (err) {
      setIsProcessing(false);
      setErrorMsg(err.message || 'Hitilafu imetokea. Tafadhali jaribu tena.');
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            My Bills
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Confirm payment. Choose method of payment.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          Malipo Salama (Secure Checkout)
        </span>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Two Main Method Boxes Matching Sketch Page 6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT BOX: Mobile Money (Vodacom, Airtel, Tigo, Halopesa) */}
        <div 
          onClick={() => setMethodType('mobile')}
          className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200 ${
            methodType === 'mobile'
              ? 'border-amber-500 bg-amber-50/40 shadow-md ring-2 ring-amber-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Lipa kwa Simu</h3>
                <p className="text-[11px] text-slate-500">M-Pesa, TigoPesa, Airtel Money, Halopesa</p>
              </div>
            </div>
            <input
              type="radio"
              checked={methodType === 'mobile'}
              onChange={() => setMethodType('mobile')}
              className="w-5 h-5 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chagua Mtandao:
              </label>
              <select
                value={mobileNetwork}
                onChange={(e) => setMobileNetwork(e.target.value)}
                disabled={methodType !== 'mobile'}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
              >
                <option value="Vodacom M-Pesa">Vodacom M-PESA (Lipa kwa Simu)</option>
                <option value="TigoPesa">TigoPesa</option>
                <option value="Airtel Money">Airtel Money</option>
                <option value="Halopesa">Halopesa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Namba ya Simu:
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
                <span className="px-3 py-2 bg-slate-100 text-slate-600 font-bold text-xs border-r border-slate-200">
                  (255)
                </span>
                <input
                  type="tel"
                  placeholder="712 345 678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  disabled={methodType !== 'mobile'}
                  className="w-full px-3 py-2 text-sm font-medium focus:outline-none disabled:opacity-60"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Ujumbe wa kuweka PIN utatumwa papo hapo kwenye namba hii.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT BOX: VISA / Mastercard (Kadi ya Benki) */}
        <div 
          onClick={() => setMethodType('card')}
          className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200 ${
            methodType === 'card'
              ? 'border-amber-500 bg-amber-50/40 shadow-md ring-2 ring-amber-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">VISA / MASTERCARD</h3>
                <p className="text-[11px] text-slate-500">Lipa kwa kadi ya Benki</p>
              </div>
            </div>
            <input
              type="radio"
              checked={methodType === 'card'}
              onChange={() => setMethodType('card')}
              className="w-5 h-5 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Namba ya Kadi:
              </label>
              <input
                type="text"
                placeholder="4111 2222 3333 4444"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                disabled={methodType !== 'card'}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tarehe (mm/yy):
                </label>
                <input
                  type="text"
                  placeholder="12/28"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  disabled={methodType !== 'card'}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  CVV:
                </label>
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  disabled={methodType !== 'card'}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM BOX: Bill Summary & Action Buttons (Matching Sketch Page 6) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider border-b pb-2">
          Muhtasari wa Malipo (Payment Summary)
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between text-slate-600">
            <span>Bill (Gharama ya Vyakula):</span>
            <span className="font-bold text-slate-900">TSh {fees.bill.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>Ada ya Muamala:</span>
            <span className="font-semibold text-amber-700">TSh {fees.fee.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-base sm:text-lg font-black text-slate-900">
            <span>Total (Jumla Kuu ya Malipo):</span>
            <span className="text-xl sm:text-2xl text-emerald-600">
              TSh {fees.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Customer Delivery Info Preview */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="flex items-center justify-between font-semibold text-slate-800">
            <span>Eneo la Kupeleka (GPS):</span>
            <span className="text-emerald-700">Limetambuliwa Kiotomatiki ✓</span>
          </div>
          <p className="font-mono text-slate-700 truncate">{detectedLocation.address}</p>
        </div>

        {/* Action Buttons: [LIPA SASA] and [BATILISHA] */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={handleCancel}
            disabled={isProcessing}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 font-bold text-sm text-slate-700 hover:bg-slate-100 transition"
          >
            BATILISHA
          </button>
          
          <button
            onClick={handlePayNow}
            disabled={isProcessing || currentBill <= 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 font-black text-sm text-white shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>LIPA SASA</span>
          </button>
        </div>

      </div>

      {/* Processing Modal Simulator */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-pulse">
              <Clock className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Inashughulikia Malipo...</h3>
              <p className="text-xs text-slate-500 mt-1">Mfumo unawasiliana na {methodType === 'mobile' ? mobileNetwork : 'Benki'}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 leading-relaxed">
              {processStep}
            </div>
            <p className="text-[11px] text-slate-400">
              Tafadhali usifunge dirisha hili hadi uthibitisho ukamilike.
            </p>
          </div>
        </div>
      )}

      {/* Payment Success & Receipt Dialog */}
      {paymentSuccessData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Malipo Yamethibitishwa!</h3>
              <p className="text-xs text-slate-500">
                Asante! Malipo yako yamefanikiwa na oda imetumwa moja kwa moja kwa Admin na jikoni.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5 font-sans">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Namba ya Oda:</span>
                <span className="font-bold font-mono text-slate-900">{paymentSuccessData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mteja:</span>
                <span className="font-bold text-slate-800">{paymentSuccessData.customer.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Njia ya Malipo:</span>
                <span className="font-bold text-emerald-700">{paymentSuccessData.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kiasi Kilicholipwa:</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  TSh {paymentSuccessData.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hali ya Oda:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  Imelipwa (Admin anagawa Dereva)
                </span>
              </div>
              <div className="flex justify-between pt-1 text-[11px] text-slate-400">
                <span>Tarehe na Muda:</span>
                <span>{paymentSuccessData.date} {paymentSuccessData.time}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setPaymentSuccessData(null);
                  if (onOrderSuccess) onOrderSuccess();
                }}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/25 transition"
              >
                Tazama Hali ya Oda Yangu (My Orders)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
