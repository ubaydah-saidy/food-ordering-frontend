import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from './apiClient';

const withResult = async (request) => {
  try {
    return { success: true, ...(await request()) };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const restaurantService = {
  login(identifier, password, role) {
    return withResult(async () => ({ user: (await apiPost('/auth/login', { identifier, password, role })).user }));
  },

  registerCustomer(data) {
    return withResult(async () => ({ user: (await apiPost('/auth/register/customer', {
      ...data,
      email: data.email?.trim() || null,
      latitude: data.coords?.lat,
      longitude: data.coords?.lng
    })).user }));
  },

  registerDeliveryStaff(data) {
    return withResult(async () => ({ user: (await apiPost('/auth/register/delivery', data)).user }));
  },

  async logout() {
    try { await apiPost('/auth/logout', {}); } catch { /* Clear local state even after an expired session. */ }
  },

  async currentUser() {
    return (await apiGet('/auth/me')).user;
  },

  saveOrUpdateCustomerProfile(userId, data) {
    return withResult(async () => {
      const profile = await apiPatch('/me', {
        fullName: data.fullName,
        username: data.username,
        phone: data.phone,
        email: data.email?.trim() || null,
        avatar: data.avatar || '',
        address: data.address,
        latitude: data.coords?.lat,
        longitude: data.coords?.lng
      });
      if (data.newPassword) {
        await apiPatch('/me/password', { oldPassword: data.oldPassword, newPassword: data.newPassword });
      }
      return { user: profile.user, message: profile.message };
    });
  },

  async getFoods(category, search) {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (search) params.set('search', search);
    return apiGet(`/menu${params.size ? `?${params}` : ''}`);
  },

  async getCart() { return apiGet('/cart'); },
  async syncCart(items) { return apiPut('/cart', { items: items.map(({ id, quantity }) => ({ menuItemId: id, quantity })) }); },
  async addCartItem(id, quantity = 1) { return apiPost('/cart/items', { menuItemId: id, quantity }); },
  async updateCartItem(id, quantity) { return apiPatch(`/cart/items/${id}`, { quantity }); },
  async removeCartItem(id) { return apiDelete(`/cart/items/${id}`); },
  async clearCart() { return apiDelete('/cart'); },

  async checkout(data) { return apiPost('/orders', data); },
  async getOrders(filter = {}) {
    if (filter.staffId) return apiGet('/delivery/orders');
    if (filter.customerId) return apiGet('/orders/mine');
    return apiGet('/admin/orders');
  },
  async getAssignedOrders() { return apiGet('/delivery/orders'); },
  async getAdminStats() { return apiGet('/admin/dashboard/stats'); },
  async getAdminMenu() { return apiGet('/admin/menu'); },

  addFood(data) { return withResult(async () => ({ food: await apiPost('/admin/menu', { ...data, price: Number(data.price) }) })); },
  updateFood(id, data) { return withResult(async () => ({ food: await apiPut(`/admin/menu/${id}`, { ...data, price: Number(data.price) }) })); },
  async deleteFood(id) { await apiDelete(`/admin/menu/${id}`); return { success: true }; },
  async assignOrder(orderId, staffId) { return apiPost(`/admin/orders/${orderId}/assignment`, { staffId: Number(staffId) }); },
  async updateOrderStatus(orderId, status) { return apiPatch(`/delivery/orders/${orderId}/status`, { status }); },
  async getDeliveryStaff() { return apiGet('/admin/delivery-staff'); },
  async getCustomers() { return apiGet('/admin/customers'); },
  registerStaffByAdmin(data) { return withResult(async () => ({ user: await apiPost('/admin/delivery-staff', data) })); },
  async deleteUser(id) { await apiDelete(`/admin/users/${id}`); return { success: true }; },
  async toggleStaffStatus(id) { return apiPatch(`/admin/delivery-staff/${id}/status`, {}); },

  async getAnnouncements() { return apiGet('/announcements'); },
  async addAnnouncement(data) { return apiPost('/admin/announcements', data); },
  async updateAnnouncement(id, data) { return apiPut(`/admin/announcements/${id}`, data); },
  async deleteAnnouncement(id) { await apiDelete(`/admin/announcements/${id}`); return { success: true }; },
  async getNotifications() { return apiGet('/notifications'); },
  async markNotificationRead(id) { return apiPatch(`/notifications/${id}/read`, {}); },
  async getAdminPayments() { return apiGet('/admin/payments'); },

  calculateFee(method, amount) {
    const total = Number(amount) || 0;
    let fee = 400;
    if (method === 'Vodacom M-Pesa') fee = total > 20000 ? 600 : 400;
    else if (method === 'TigoPesa') fee = total > 20000 ? 550 : 350;
    else if (method === 'Airtel Money') fee = total > 20000 ? 500 : 350;
    else if (method === 'Halopesa') fee = total > 20000 ? 450 : 300;
    else if (method.startsWith('Visa')) fee = Math.round(total * 0.015);
    return { billAmount: total, transactionFee: fee, totalAmount: total + fee };
  }
};