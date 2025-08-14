import "@/styles/bootstrap.min.css";
import { SWRConfig } from "swr";
import Layout from "@/components/Layout";
import RouteGuard from "@/components/RouteGuard";
import { useEffect } from "react";
import { tokenAtom } from "@/store";
import { useAtom } from "jotai";
import { readToken } from "@/lib/authenticate";
import { default as jwtDecode } from "jwt-decode";

export default function App({ Component, pageProps }) {
  const [, setToken] = useAtom(tokenAtom);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (!storedToken) return setToken(null);

    try {
      const decoded = jwtDecode(storedToken);
      if (decoded?.exp && Date.now() >= decoded.exp * 1000) {
        localStorage.removeItem("auth_token");
        setToken(null);
      } else {
        setToken(decoded);
      }
    } catch (err) {
      console.error("Token decode error:", err);
      localStorage.removeItem("auth_token");
      setToken(null);
    }
  }, []);
  return (
    <RouteGuard>
      <Layout>
        <SWRConfig
          value={{
            fetcher: async (url) => {
              console.log(`Fetching data from: ${url}`);
              const res = await fetch(url);

              if (!res.ok) {
                const error = new Error(
                  "An error occurred while fetching the data."
                );
                error.info = await res.json();
                error.status = res.status;
                console.error("SWR fetch error:", error);
                throw error;
              }

              return res.json();
            },
            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
              // Don't retry on 404
              if (error.status === 404) return;

              // Don't retry more than 3 times
              if (retryCount >= 3) return;

              // Retry after 5 seconds
              setTimeout(() => revalidate({ retryCount }), 5000);
            },
          }}
        >
          <Component {...pageProps} />
        </SWRConfig>
      </Layout>
    </RouteGuard>
  );
}
