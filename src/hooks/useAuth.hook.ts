import { useState, useEffect, useCallback } from 'react';
import { IAuthService } from '../interfaces/services.interface';
import { LoginRequest, LoginResponse, Partner } from '../types/auth.types';
import { validatePartners } from '../utils/validatePartners';

const loadUserFromStorage = (authService: IAuthService): LoginResponse | null => {
  return authService.getCurrentUser();
};

const loadPartnersFromApi = async (authService: IAuthService): Promise<Partner[]> => {
  try {
    const response = await authService.getAllPartners();
    const validated = validatePartners(response);
    return validated;
  } catch (error) {
    return [];
  }
};

const partnersCache = new WeakMap<IAuthService, Partner[]>();
const loadingPromises = new WeakMap<IAuthService, Promise<Partner[]>>();

export const useAuth = (authService: IAuthService) => {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [partners, setPartners] = useState<Partner[]>(() => {
    return partnersCache.get(authService) || [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = loadUserFromStorage(authService);
    setUser(currentUser);
  }, [authService]);

  const login = useCallback(
    async (request: LoginRequest): Promise<void> => {
      setLoading(true);
      try {
        const response = await authService.login(request);
        setUser(response);
      } finally {
        setLoading(false);
      }
    },
    [authService]
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, [authService]);

  const loadPartners = useCallback(async () => {
    const partnersList = await loadPartnersFromApi(authService);
    if (Array.isArray(partnersList)) {
      setPartners(partnersList);
    }
  }, [authService]);

  useEffect(() => {
    const cached = partnersCache.get(authService);
    if (cached && cached.length > 0) {
      setPartners(cached);
      return;
    }

    const existingPromise = loadingPromises.get(authService);
    if (existingPromise) {
      existingPromise.then((partnersList) => {
        if (Array.isArray(partnersList)) {
          setPartners(partnersList);
        }
      });
      return;
    }

    let isMounted = true;

    const fetchPartners = async (): Promise<Partner[]> => {
      const partnersList = await loadPartnersFromApi(authService);
      if (Array.isArray(partnersList)) {
        partnersCache.set(authService, partnersList);
        if (isMounted) {
          setPartners(partnersList);
        }
      }
      loadingPromises.delete(authService);
      return partnersList;
    };

    const promise = fetchPartners();
    loadingPromises.set(authService, promise);

    return () => {
      isMounted = false;
    };
  }, [authService]);

  return {
    user,
    partners,
    loading,
    login,
    logout,
    isLoggedIn: authService.isLoggedIn(),
    reloadPartners: loadPartners,
  };
};

