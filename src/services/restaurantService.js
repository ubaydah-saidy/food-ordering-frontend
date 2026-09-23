// Complete in-browser Data & Service Layer for Pure React Frontend
// Stored and synchronized in localStorage for full persistence
// Version 3: 100% English Language, Dynamic Food/Drinks/Snacks Catalog, and Full Announcement Management

const DB_KEY = 'our_restaurant_db_v3';

const initialStoreData = {
  users: [
    // Pre-configured Super Admin account
    {
      id: "admin-1",
      username: "ABDALLAH SAIDY",
      password: "abdallah2018",
      fullName: "Abdallah Saidy",
      role: "admin",
      phone: "+255 777 123 456",
      email: "abdallah@ourrestaurant.co.tz",
      avatar: "",
      createdAt: new Date().toISOString()
    }
  ],
  foods: [
    // --- FOODS CATEGORY ---
    {
      id: "food-1",
      name: "Special Chicken Biryani",
      category: "Foods",
      price: 12000,
      description: "Authentic Zanzibar chicken biryani infused with aromatic spices, served with fresh side kachumbari salad.",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "food-2",
      name: "Traditional Beef Pilau",
      category: "Foods",
      price: 10000,
      description: "Rich and fragrant Swahili spiced beef pilau rice flavored with cardamom, cinnamon, served with banana and chili.",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "food-3",
      name: "Chips Mayai / Special Zege",
      category: "Foods",
      price: 5000,
      description: "Crisp golden french fries pan-fried with two fresh eggs, onions, and served with spicy tomato kachumbari.",
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "food-4",
      name: "Coconut Fish Curry & Ugali",
      category: "Foods",
      price: 15000,
      description: "Fresh ocean fish simmered in rich spiced coconut cream sauce, served alongside piping hot ugali.",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "food-5",
      name: "Ugali & Roast Meat (Nyama Choma)",
      category: "Foods",
      price: 14000,
      description: "Tender flame-grilled goat meat paired with white corn ugali, sautéed collard greens, and zesty kachumbari.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "food-6",
      name: "Steamed Rice, Coconut Beans & Spinach",
      category: "Foods",
      price: 4500,
      description: "Aromatic basmati rice served with simmered coconut red kidney beans and pan-tossed garlic spinach.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "food-7",
      name: "Classic Beef Burger & French Fries",
      category: "Foods",
      price: 9500,
      description: "Juicy grilled prime beef burger with melted cheddar cheese, crisp lettuce, tomatoes, and golden fries.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "food-8",
      name: "Grilled Chicken Shawarma Wrap",
      category: "Foods",
      price: 7000,
      description: "Marinated roasted chicken slices wrapped in soft pita bread with garlic sauce, pickled cucumbers, and tahini.",
      image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&auto=format&fit=crop&q=80",
      available: true
    },

    // --- SNACKS CATEGORY ---
    {
      id: "snack-1",
      name: "Crispy Beef Samosas (3 Pcs)",
      category: "Snacks",
      price: 3000,
      description: "Three deep-fried golden pastry triangles generously stuffed with savory minced beef, onions, and herbs.",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "snack-2",
      name: "Cardamom Sweet Mandazi (4 Pcs)",
      category: "Snacks",
      price: 2000,
      description: "Four soft, golden fried East African donuts infused with aromatic ground cardamom and sweet coconut milk.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "snack-3",
      name: "Crispy Chickpea Bajias & Chutney",
      category: "Snacks",
      price: 2500,
      description: "Crisp seasoned chickpea flour fritters loaded with fresh herbs, served with homemade tamarind chutney.",
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "snack-4",
      name: "Layered Chapati Egg Roll (Rolex)",
      category: "Snacks",
      price: 3500,
      description: "Warm flaky pan-tossed chapati rolled with a fresh two-egg omelet, sweet bell peppers, and diced tomatoes.",
      image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "snack-5",
      name: "Coconut Rice Cakes / Vitumbua (4 Pcs)",
      category: "Snacks",
      price: 2000,
      description: "Four sweet, fluffy rice flour and coconut milk pancakes, tender inside with a delightful golden crust.",
      image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "snack-6",
      name: "Charcoal Grilled Beef Skewers (3 Pcs)",
      category: "Snacks",
      price: 6000,
      description: "Three succulent skewers of marinated beef tenderloin cubes grilled to smoky perfection over glowing charcoal.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80",
      available: true
    },

    // --- DRINKS CATEGORY ---
    {
      id: "drink-1",
      name: "Chilled Fresh Mango Juice",
      category: "Drinks",
      price: 3000,
      description: "Pure thick 100% natural mango juice freshly pressed daily with zero artificial colors or preservatives.",
      image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "drink-2",
      name: "Fresh Passion Fruit Juice",
      category: "Drinks",
      price: 3000,
      description: "Refreshing natural passion fruit juice with an invigorating sweet-tangy punch, served icy cold.",
      image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "drink-3",
      name: "Azam Energy Drink (Chilled)",
      category: "Drinks",
      price: 1500,
      description: "Ice-cold sparkling energy drink designed to revitalize and refresh your stamina throughout the day.",
      image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "drink-4",
      name: "Spiced Milk Tea (Ginger Masala)",
      category: "Drinks",
      price: 2500,
      description: "Steaming hot whole milk tea simmered with highland black tea leaves, crushed ginger root, and cardamom.",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "drink-5",
      name: "Canned Soda (Coca-Cola/Sprite/Fanta)",
      category: "Drinks",
      price: 1500,
      description: "Ice-cold 330ml can of your choice: Coca-Cola, Fanta Orange, or crisp lemon-lime Sprite.",
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80",
      available: true
    },
    {
      id: "drink-6",
      name: "Kilimanjaro Mineral Water (1.5L)",
      category: "Drinks",
      price: 1500,
      description: "Pure natural mountain spring water bottled directly from Mount Kilimanjaro, chilled for maximum hydration.",
      image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80",
      available: true
    }
  ],
  orders: [],
  notifications: [],
  announcements: [
    {
      id: "ann-1",
      title: "WEEKEND MEGA DISCOUNT!",
      message: "Get 15% OFF on all Special Chicken Biryani and Coconut Fish dishes today! Free GPS delivery on orders above TZS 30,000.",
      badge: "SPECIAL OFFER",
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    {
      id: "ann-2",
      title: "INSTANT LIVE GPS ORDER TRACKING",
      message: "Our system automatically pinpoints your real-time GPS location for rapid, piping hot doorstep food delivery with live updates!",
      badge: "HOT DEAL",
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    }
  ]
};

class RestaurantService {
  constructor() {
    this.init();
  }

  init() {
    try {
      localStorage.removeItem('our_restaurant_db_v1');
      localStorage.removeItem('our_restaurant_db_v2');
      const stored = localStorage.getItem(DB_KEY);
      if (!stored) {
        localStorage.setItem(DB_KEY, JSON.stringify(initialStoreData));
      } else {
        const db = JSON.parse(stored);
        let updated = false;
        // Ensure Admin exists
        if (!db.users || !db.users.some(u => u.role === 'admin')) {
          if (!db.users) db.users = [];
          db.users.push(initialStoreData.users[0]);
          updated = true;
        }
        // Ensure announcements exists
        if (!db.announcements || db.announcements.length === 0) {
          db.announcements = initialStoreData.announcements;
          updated = true;
        }
        // Ensure foods exists
        if (!db.foods || db.foods.length === 0) {
          db.foods = initialStoreData.foods;
          updated = true;
        }
        if (updated) {
          localStorage.setItem(DB_KEY, JSON.stringify(db));
        }
      }
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }

  getDb() {
    try {
      const stored = localStorage.getItem(DB_KEY);
      return stored ? JSON.parse(stored) : initialStoreData;
    } catch {
      return initialStoreData;
    }
  }

  saveDb(db) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
      window.dispatchEvent(new Event('restaurant_db_updated'));
    } catch (e) {
      console.error('Save error:', e);
    }
  }

  // --- ANNOUNCEMENTS / MARQUEE METHODS ---
  getAnnouncements() {
    const db = this.getDb();
    return db.announcements || [];
  }

  addAnnouncement(data) {
    const db = this.getDb();
    if (!db.announcements) db.announcements = [];
    const newAnn = {
      id: `ann-${Date.now()}`,
      title: (data.title || 'Special Announcement').trim(),
      message: (data.message || '').trim(),
      badge: (data.badge || 'SPECIAL OFFER').trim().toUpperCase(),
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };
    db.announcements.unshift(newAnn);
    this.saveDb(db);
    return { success: true, announcement: newAnn, message: 'Announcement published successfully!' };
  }

  updateAnnouncement(id, data) {
    const db = this.getDb();
    if (!db.announcements) db.announcements = [];
    const index = db.announcements.findIndex(a => a.id === id);
    if (index === -1) {
      return { success: false, error: 'Announcement not found.' };
    }
    db.announcements[index] = {
      ...db.announcements[index],
      title: data.title ? data.title.trim() : db.announcements[index].title,
      message: data.message ? data.message.trim() : db.announcements[index].message,
      badge: data.badge ? data.badge.trim().toUpperCase() : db.announcements[index].badge,
      updatedAt: new Date().toISOString()
    };
    this.saveDb(db);
    return { success: true, announcement: db.announcements[index], message: 'Announcement updated successfully!' };
  }

  deleteAnnouncement(id) {
    const db = this.getDb();
    if (!db.announcements) return { success: true };
    db.announcements = db.announcements.filter(a => a.id !== id);
    this.saveDb(db);
    return { success: true, message: 'Announcement deleted successfully!' };
  }

  // --- AUTH METHODS (Pure In-Browser LocalStorage Database) ---
  login(usernameOrPhone, password, role) {
    const db = this.getDb();
    const query = (usernameOrPhone || '').trim().toLowerCase();
    const pwd = (password || '').trim();

    if (!query || !pwd) {
      return { success: false, error: 'Please enter both username/phone and password.' };
    }

    // Match by username (case-insensitive), phone, or email
    const user = db.users.find(u => {
      const matchUsername = u.username && u.username.toLowerCase() === query;
      const matchPhone = u.phone && u.phone.replace(/\s+/g, '') === query.replace(/\s+/g, '');
      const matchEmail = u.email && u.email.toLowerCase() === query;
      return matchUsername || matchPhone || matchEmail;
    });

    if (!user) {
      return { success: false, error: 'Account not found. Please verify your credentials or register.' };
    }

    if (user.password !== pwd) {
      return { success: false, error: 'Invalid password. Please try again.' };
    }

    if (role && user.role !== role) {
      return {
        success: false,
        error: `This account is registered as a ${user.role.toUpperCase()}, not ${role.toUpperCase()}. Please use the correct login portal.`
      };
    }

    const { password: _, ...userSafe } = user;
    return { success: true, user: userSafe };
  }

  // Customer Self-Registration (Pure In-Browser)
  registerCustomer(customerData) {
    const db = this.getDb();
    const { username, password, fullName, phone, email, address, coords } = customerData;

    if (!fullName || !fullName.trim()) {
      return { success: false, error: 'Full Name is required.' };
    }
    if (!phone || !phone.trim()) {
      return { success: false, error: 'Phone number is required.' };
    }
    if (!password || password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    const cleanPhone = phone.trim();
    const cleanUsername = (username && username.trim()) ? username.trim() : cleanPhone;

    // Check duplicate
    const exists = db.users.find(u =>
      (u.phone && u.phone.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, '')) ||
      (u.username && u.username.toLowerCase() === cleanUsername.toLowerCase())
    );

    if (exists) {
      return { success: false, error: 'An account with this phone number or username already exists. Please log in.' };
    }

    const newCustomer = {
      id: `cust-${Date.now()}`,
      username: cleanUsername,
      password: password.trim(),
      fullName: fullName.trim(),
      role: 'customer',
      phone: cleanPhone,
      email: (email || '').trim(),
      address: address || 'Dar es Salaam, Tanzania',
      coords: coords || { lat: -6.8185, lng: 39.2745 },
      avatar: '',
      createdAt: new Date().toISOString()
    };

    db.users.push(newCustomer);
    this.saveDb(db);

    const { password: _, ...userSafe } = newCustomer;
    return { success: true, user: userSafe, message: 'Customer account registered successfully!' };
  }

  // Delivery Staff Self-Registration (Pure In-Browser)
  // Requirement: phoneNumber, fullName, Email (STRICTLY MANDATORY), password, Address, vehicle
  registerDeliveryStaff(staffData) {
    const db = this.getDb();
    const { fullName, phone, email, password, address, vehicle, username } = staffData;

    if (!fullName || !fullName.trim()) {
      return { success: false, error: 'Full Name is required.' };
    }
    if (!phone || !phone.trim()) {
      return { success: false, error: 'Phone Number is required.' };
    }
    if (!email || !email.trim()) {
      return { success: false, error: 'Email Address is strictly MANDATORY for Delivery Staff.' };
    }
    if (!password || password.length < 4) {
      return { success: false, error: 'Password is required (at least 4 characters).' };
    }
    if (!address || !address.trim()) {
      return { success: false, error: 'Address/Operating Area is required.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanUsername = (username && username.trim()) ? username.trim() : cleanEmail.split('@')[0];

    // Check duplicate
    const exists = db.users.find(u =>
      (u.email && u.email.toLowerCase() === cleanEmail) ||
      (u.phone && u.phone.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, '')) ||
      (u.username && u.username.toLowerCase() === cleanUsername.toLowerCase())
    );

    if (exists) {
      return { success: false, error: 'A staff member with this Email or Phone number already exists. Please log in.' };
    }

    const newStaff = {
      id: `staff-${Date.now()}`,
      username: cleanUsername,
      password: password.trim(),
      fullName: fullName.trim(),
      role: 'delivery',
      phone: cleanPhone,
      email: cleanEmail,
      address: address.trim(),
      vehicle: (vehicle && vehicle.trim()) ? vehicle.trim() : 'Motorcycle (Boxer MC)',
      status: 'Available',
      avatar: '',
      createdAt: new Date().toISOString()
    };

    db.users.push(newStaff);
    this.saveDb(db);

    const { password: _, ...userSafe } = newStaff;
    return { success: true, user: userSafe, message: 'Delivery Staff account registered successfully!' };
  }

  // Save or Update Customer Profile from Personal Information Page
  saveOrUpdateCustomerProfile(currentUserId, profileData) {
    const db = this.getDb();
    let userIndex = currentUserId ? db.users.findIndex(u => u.id === currentUserId) : -1;

    // If user doesn't exist yet, create a new customer record
    if (userIndex === -1) {
      const generatedId = `cust-${Date.now()}`;
      const newCustomer = {
        id: generatedId,
        username: profileData.username?.trim() || `customer_${Date.now().toString().slice(-4)}`,
        password: profileData.newPassword || '123456',
        fullName: profileData.fullName?.trim() || 'Valued Customer',
        role: 'customer',
        phone: profileData.phone?.trim() || '',
        email: profileData.email?.trim() || '',
        address: profileData.address || 'Dar es Salaam, Tanzania',
        coords: profileData.coords || { lat: -6.8185, lng: 39.2745 },
        avatar: profileData.avatar || '',
        createdAt: new Date().toISOString()
      };
      db.users.push(newCustomer);
      this.saveDb(db);
      const { password: _, ...safe } = newCustomer;
      return { success: true, user: safe, message: 'Profile information saved successfully!' };
    }

    // Existing user update
    const user = db.users[userIndex];
    if (user.role === 'admin' || user.id === 'admin-1') {
      return { success: false, error: 'Security restriction: Super Admin credentials cannot be modified through the customer portal!' };
    }
    if (profileData.fullName) user.fullName = profileData.fullName.trim();
    if (profileData.username) user.username = profileData.username.trim();
    if (profileData.phone) user.phone = profileData.phone.trim();
    if (profileData.email !== undefined) user.email = profileData.email.trim();
    if (profileData.avatar !== undefined) user.avatar = profileData.avatar;
    if (profileData.address) user.address = profileData.address;
    if (profileData.coords) user.coords = profileData.coords;

    // Password change check
    if (profileData.newPassword) {
      if (profileData.oldPassword && user.password !== profileData.oldPassword) {
        return { success: false, error: 'Current password does not match our records.' };
      }
      user.password = profileData.newPassword;
    }

    this.saveDb(db);
    const { password: _, ...safe } = user;
    return { success: true, user: safe, message: 'Profile information updated successfully!' };
  }

  // Admin Delete or Manage Users
  deleteUser(userId) {
    const db = this.getDb();
    const target = db.users.find(u => u.id === userId);
    if (!target) return { success: false, error: 'User account not found.' };
    if (target.role === 'admin' || target.id === 'admin-1') {
      return { success: false, error: 'Security restriction: Super Admin account cannot be deleted!' };
    }
    db.users = db.users.filter(u => u.id !== userId);
    this.saveDb(db);
    return { success: true, message: 'User account removed successfully!' };
  }

  toggleStaffStatus(staffId) {
    const db = this.getDb();
    const staff = db.users.find(u => u.id === staffId);
    if (staff) {
      staff.status = staff.status === 'Available' ? 'Busy / On Delivery' : 'Available';
      this.saveDb(db);
      return { success: true, status: staff.status };
    }
    return { success: false, error: 'Staff member not found.' };
  }

  // --- FOODS & DRINKS METHODS ---
  getFoods(category, search) {
    const db = this.getDb();
    let list = db.foods || [];

    if (category && category !== 'All') {
      list = list.filter(f => f.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(f => 
        f.name.toLowerCase().includes(q) || 
        (f.description && f.description.toLowerCase().includes(q))
      );
    }

    return list;
  }

  addFood(food) {
    const db = this.getDb();
    const newFood = {
      id: `food-${Date.now()}`,
      name: food.name.trim(),
      category: food.category.trim(),
      price: Number(food.price),
      description: food.description || '',
      image: food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
      available: food.available !== undefined ? Boolean(food.available) : true
    };

    db.foods.unshift(newFood);
    this.saveDb(db);
    return { success: true, food: newFood, message: 'Item added to menu successfully!' };
  }

  updateFood(id, updates) {
    const db = this.getDb();
    const idx = db.foods.findIndex(f => f.id === id);
    if (idx === -1) return { success: false, error: 'Menu item not found.' };

    db.foods[idx] = { 
      ...db.foods[idx], 
      ...updates, 
      price: updates.price ? Number(updates.price) : db.foods[idx].price 
    };
    this.saveDb(db);
    return { success: true, food: db.foods[idx], message: 'Menu item updated successfully!' };
  }

  deleteFood(id) {
    const db = this.getDb();
    db.foods = db.foods.filter(f => f.id !== id);
    this.saveDb(db);
    return { success: true, message: 'Item removed from restaurant menu!' };
  }

  // --- ORDERS METHODS ---
  getOrders(filter = {}) {
    const db = this.getDb();
    let orders = [...(db.orders || [])];

    if (filter.customerId) {
      orders = orders.filter(o => o.customer && o.customer.id === filter.customerId);
    }
    if (filter.staffId) {
      orders = orders.filter(o => o.assignedStaff && o.assignedStaff.id === filter.staffId);
    }
    if (filter.status && filter.status !== 'All') {
      orders = orders.filter(o => o.orderStatus.toLowerCase() === filter.status.toLowerCase());
    }

    orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return orders;
  }

  createOrder(orderData) {
    const db = this.getDb();
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: orderId,
      customer: orderData.customer,
      items: orderData.items,
      billAmount: Number(orderData.billAmount) || 0,
      transactionFee: Number(orderData.transactionFee) || 0,
      totalAmount: Number(orderData.totalAmount) || (Number(orderData.billAmount) + Number(orderData.transactionFee)),
      paymentMethod: orderData.paymentMethod || 'Vodacom M-Pesa',
      paymentPhoneOrCard: orderData.paymentPhoneOrCard || 'N/A',
      paymentStatus: 'Paid',
      orderStatus: 'Paid',
      assignedStaff: null,
      date: formattedDate,
      time: formattedTime,
      createdAt: now.toISOString()
    };

    db.orders.unshift(newOrder);

    // Notify Admin
    db.notifications.unshift({
      id: `notif-${Date.now()}-adm`,
      userId: 'admin-1',
      title: 'New Paid Order Received!',
      message: `Customer ${newOrder.customer.fullName} paid TZS ${newOrder.totalAmount.toLocaleString()} via ${newOrder.paymentMethod} (Order #${orderId}). Please assign a delivery staff.`,
      read: false,
      date: `${formattedDate} ${formattedTime}`
    });

    // Notify Customer
    if (newOrder.customer.id) {
      db.notifications.unshift({
        id: `notif-${Date.now()}-cust`,
        userId: newOrder.customer.id,
        title: 'Order & Payment Confirmed!',
        message: `Your order #${orderId} for TZS ${newOrder.totalAmount.toLocaleString()} has been received and is waiting for driver assignment.`,
        read: false,
        date: `${formattedDate} ${formattedTime}`
      });
    }

    this.saveDb(db);
    return { success: true, order: newOrder, message: 'Order and payment confirmed successfully!' };
  }

  assignOrder(orderId, staffId) {
    const db = this.getDb();
    const orderIndex = db.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return { success: false, error: 'Order not found.' };

    const staff = db.users.find(u => u.id === staffId && u.role === 'delivery');
    if (!staff) return { success: false, error: 'Delivery driver not found.' };

    db.orders[orderIndex].assignedStaff = {
      id: staff.id,
      fullName: staff.fullName,
      phone: staff.phone,
      vehicle: staff.vehicle || 'Delivery Motorcycle'
    };
    db.orders[orderIndex].orderStatus = 'Assigned';

    const order = db.orders[orderIndex];
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Notify Customer
    if (order.customer.id) {
      db.notifications.unshift({
        id: `notif-${Date.now()}-c`,
        userId: order.customer.id,
        title: 'Driver Assigned to Your Order!',
        message: `Order #${order.id} has been assigned to driver ${staff.fullName} (Phone: ${staff.phone}). Delicious food is on the way!`,
        read: false,
        date: timeStr
      });
    }

    // Notify Staff
    db.notifications.unshift({
      id: `notif-${Date.now()}-s`,
      userId: staff.id,
      title: 'New Delivery Assigned!',
      message: `You have been assigned to deliver order #${order.id} to ${order.customer.fullName} (${order.customer.phone}) at ${order.customer.address}.`,
      read: false,
      date: timeStr
    });

    this.saveDb(db);
    return { success: true, order: db.orders[orderIndex], message: `Order assigned to ${staff.fullName} successfully!` };
  }

  updateOrderStatus(orderId, status) {
    const db = this.getDb();
    const idx = db.orders.findIndex(o => o.id === orderId);
    if (idx === -1) return { success: false, error: 'Order not found.' };

    db.orders[idx].orderStatus = status;
    const order = db.orders[idx];
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    let msg = `Your order #${order.id} is now: ${status}.`;
    if (status === 'Out for Delivery') {
      msg = `Driver ${order.assignedStaff ? order.assignedStaff.fullName : ''} is on the way with your order #${order.id}. Please be ready to receive!`;
    } else if (status === 'Delivered') {
      msg = `Your order #${order.id} has been delivered successfully. Thank you for dining with OUR RESTAURANT!`;
    }

    if (order.customer.id) {
      db.notifications.unshift({
        id: `notif-${Date.now()}-status`,
        userId: order.customer.id,
        title: `Order Status Update #${order.id}`,
        message: msg,
        read: false,
        date: timeStr
      });
    }

    this.saveDb(db);
    return { success: true, order: db.orders[idx], message: `Order status updated to '${status}' successfully!` };
  }

  // --- USERS METHODS ---
  getDeliveryStaff() {
    const db = this.getDb();
    return db.users.filter(u => u.role === 'delivery').map(({ password: _, ...u }) => u);
  }

  getCustomers() {
    const db = this.getDb();
    return db.users.filter(u => u.role === 'customer').map(({ password: _, ...u }) => u);
  }

  // --- PAYMENTS METHODS ---
  calculateFee(method, amount) {
    const num = Number(amount) || 0;
    let fee = 0;
    switch (method) {
      case 'Vodacom M-Pesa':
        fee = num > 20000 ? 600 : 400;
        break;
      case 'TigoPesa':
        fee = num > 20000 ? 550 : 350;
        break;
      case 'Airtel Money':
        fee = num > 20000 ? 500 : 350;
        break;
      case 'Halopesa':
        fee = num > 20000 ? 450 : 300;
        break;
      case 'Visa/Mastercard':
      case 'Visa / Mastercard (Kadi ya Benki)':
        fee = Math.round(num * 0.015);
        break;
      default:
        fee = 400;
    }
    return { billAmount: num, transactionFee: fee, totalAmount: num + fee };
  }

  // --- NOTIFICATIONS ---
  getNotifications(userId) {
    const db = this.getDb();
    const notifs = db.notifications || [];
    if (userId) {
      return notifs.filter(n => n.userId === userId || n.userId === 'all');
    }
    return notifs;
  }

  markNotificationRead(id) {
    const db = this.getDb();
    const notif = db.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveDb(db);
    }
    return { success: true };
  }

  // --- ADMIN STATS ---
  getAdminStats() {
    const db = this.getDb();
    const totalSales = db.orders
      .filter(o => o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    const totalOrders = db.orders.length;
    const pendingAssignment = db.orders.filter(o => o.orderStatus === 'Paid' && !o.assignedStaff).length;
    const activeDeliveries = db.orders.filter(o => o.orderStatus === 'Out for Delivery' || o.orderStatus === 'Assigned').length;
    const deliveredCount = db.orders.filter(o => o.orderStatus === 'Delivered').length;
    const totalCustomers = db.users.filter(u => u.role === 'customer').length;
    const totalStaff = db.users.filter(u => u.role === 'delivery').length;
    const totalFoods = db.foods.length;

    return {
      totalSales,
      totalOrders,
      pendingAssignment,
      activeDeliveries,
      deliveredCount,
      totalCustomers,
      totalStaff,
      totalFoods
    };
  }
}

export const restaurantService = new RestaurantService();
