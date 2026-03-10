import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper function to generate unique cart item ID
const generateCartItemId = (item) => {
  if (item.selectedCharacteristics && Object.keys(item.selectedCharacteristics).length > 0) {
    // Create a unique ID based on product ID + selected characteristics
    const charString = Object.entries(item.selectedCharacteristics)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join('|');
    return `${item.id}__${charString}`;
  }
  return item.id;
};

// Cart Store
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Add item to cart (with characteristics support)
      addItem: (item) => {
        const items = get().items;
        const cartItemId = generateCartItemId(item);
        
        // Check if exact same item (with same characteristics) exists
        const existingItem = items.find(i => i.cartItemId === cartItemId);
        
        if (existingItem) {
          // Increment quantity
          set({
            items: items.map(i =>
              i.cartItemId === cartItemId
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            )
          });
        } else {
          // Add new item with cartItemId
          set({
            items: [...items, { 
              ...item, 
              cartItemId,
              quantity: item.quantity || 1 
            }]
          });
        }
      },
      
      // Remove item by cartItemId
      removeItem: (cartItemId) => {
        set({
          items: get().items.filter(i => i.cartItemId !== cartItemId && i.id !== cartItemId)
        });
      },
      
      // Update quantity
      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
        } else {
          set({
            items: get().items.map(i =>
              (i.cartItemId === cartItemId || i.id === cartItemId) ? { ...i, quantity } : i
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
          return total + (Number(item.price) * item.quantity);
        }, 0);
      },

      // Get item count
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
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
