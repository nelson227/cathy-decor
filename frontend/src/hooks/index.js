import { useCartStore, useAuthStore, useFavoritesStore } from '../store';

// Hook for cart
export const useCart = () => {
  return useCartStore();
};

// Hook for auth
export const useAuth = () => {
  return useAuthStore();
};

// Hook for favorites
export const useFavorites = () => {
  return useFavoritesStore();
};
