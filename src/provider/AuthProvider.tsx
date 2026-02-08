import type User from "../models/User";
import apiClient from "../services/Apiclient";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { CheckCircle2 } from "lucide-react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextType {
  logout: () => void;
  fetchState: "notReady" | "ready" | "registering" | "logging" | "applying";
  login: (email: string, password: string) => void;
  user?: User;
}

// Extend InternalAxiosRequestConfig to include _retry
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface Response {
  status: boolean;
  token?: string;
  message?: string;
  user: User;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext must be used within AuthProvider");
  return context;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<boolean | null>(null);

  const [fetchState, setFetchState] = useState<
    "notReady" | "logging" | "ready" | "registering" | "applying"
  >("notReady");

  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${savedToken}`;
    } else {
      delete apiClient.defaults.headers.common["Authorization"];
    }
    return savedToken ?? null;
  });

  const [user, setUser] = useState<User>();

  const login = useCallback(async (email: string, password: string) => {
    setFetchState("logging");
    try {
      const response = await apiClient.post<Response>("/login", {
        email,
        password,
      });
      if (response.data.status) {
        const token = response.data.token ?? "";
        setToken(token);
        localStorage.setItem("auth_token", token);
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(response.data.user);
        toast("Log In Successfully", {
          icon: <CheckCircle2 />,
          style: { display: "flex", alignItems: "center", gap: "1rem" },
        });
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (e) {
      console.error(e);
      setToken(null);
      // localStorage.removeItem("auth_token");
    } finally {
      setFetchState("ready");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post<Response>("/logout");
    } catch (err) {
      console.error(err);
    } finally {
      setUser(undefined);
      setToken(null);
      localStorage.removeItem("auth_token");
      delete apiClient.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
  }, []);

  useLayoutEffect(() => {
    if (!mounted && !ref.current) {
      const fetchMe = async () => {
        setFetchState("notReady");
        try {
          const response = await apiClient.post<Response>("/refresh");
          if (response.data.status && response.data.token) {
            setToken(response.data.token);
            localStorage.setItem("auth_token", response.data.token);
            apiClient.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${response.data.token}`;
            setUser(response.data.user);
          }
        } catch (err) {
          console.error("Token refresh failed", err);
          setToken(null);
        //   localStorage.removeItem("auth_token");
        } finally {
          setFetchState("ready");
        }
      };
      fetchMe();
      setMounted(true);
      ref.current = true;
    }
  }, [mounted]);

  // ✅ Attach token to every Axios request
  useLayoutEffect(() => {
    const authInterceptor = apiClient.interceptors.request.use(
      (config: ExtendedAxiosRequestConfig) => {
        if (!config._retry && token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        config.withCredentials = true;
        return config;
      }
    );
    return () => {
      apiClient.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  // ✅ Handle token refresh on 403 errors
  useEffect(() => {
    let isRefreshing = false;
    const refreshInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;
        if (
          error.response?.status === 403 &&
          !originalRequest._retry &&
          !isRefreshing
        ) {
          isRefreshing = true;
          originalRequest._retry = true;
          try {
            const response = await apiClient.post<Response>("/refresh");
            if (response.data.token) {
              setToken(response.data.token);
              localStorage.setItem("auth_token", response.data.token);
              apiClient.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${response.data.token}`;
              originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
              isRefreshing = false;
              return apiClient(originalRequest);
            }
          } catch (refreshError) {
            console.error(
              "Token refresh failed during interceptor",
              refreshError
            );
            setToken(null);
            localStorage.removeItem("auth_token");
            isRefreshing = false;
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      apiClient.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      logout,
      login,
      user,
      fetchState,
    }),
    [logout, login, user, fetchState]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
