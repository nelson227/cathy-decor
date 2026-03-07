import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Cart Store
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Add item to cart
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(i => i.id === item.id);
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            )
          });
        } else {
          set({
            items: [...items, { ...item, quantity: item.quantity || 1 }]
          });
        }
      },
      
      // Remove item
      removeItem: (itemId) => {
        set({
          items: get().items.filter(i => i.id !== itemId)
        });
      },
      
      // Update quantity
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
        } else {
          set({
            items: get().items.map(i =>
              i.id === itemId ? { ...i, quantity } : i
            )
          });
        }
      },
      
      // Clear cart
      clearCart: () => {
        set({ items: [] });
      },
      
      // Get total
      getTotal: () => {
        return get().items.reduce((total, item) => {
          return total + (item.price * item.quantity);
        }, 0);
      }
    }),
    {
      name: 'cathy-cart'
    }
  )
);

// Auth Store
export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('cathy-auth-user')) || null,
  token: localStorage.getItem('cathy-auth-token') || null,
  isAuthenticated: !!localStorage.getItem('cathy-auth-token'),
  
  login: (user, token) => {
    localStorage.setItem('cathy-auth-token', token);
    localStorage.setItem('cathy-auth-user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('cathy-auth-token');
    localStorage.removeItem('cathy-auth-user');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));

// Favorites Store
export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addFavorite: (itemId) => {
        if (!get().items.includes(itemId)) {
          set({ items: [...get().items, itemId] });
        }
      },
      
      removeFavorite: (itemId) => {
        set({ items: get().items.filter(id => id !== itemId) });
      },
      
      isFavorite: (itemId) => {
        return get().items.includes(itemId);
      }
    }),
    {
      name: 'cathy-favorites'
    }
  )
);
