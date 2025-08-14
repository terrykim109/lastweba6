"use client";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { getFavourites, getHistory } from '@/lib/userData';
import { isAuthenticated } from '@/lib/authenticate';

const PUBLIC_PATHS = ['/login', '/register']; // allows access without login

export default function RouteGuard({ children }) {
  const router = useRouter();
  // jotai for favs and search history
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [, setSearchHistory] = useAtom(searchHistoryAtom);

  useEffect(() => {
    updateAtoms();
    // check authentication
    authCheck(router.pathname);
  }, []);

  // updating atoms with user data
  async function updateAtoms() {
    try {
      if (isAuthenticated()) {
        console.log("Updating atoms from RouteGuard");
        setFavouritesList(await getFavourites());
        setSearchHistory(await getHistory());
      }
    } catch (err) {
      console.error("Error updating atoms:", err);
    }
  }

  function authCheck(path) {
    
    const basePath = path.split('?')[0];
    
    // for non-members
    if (PUBLIC_PATHS.includes(basePath)) {
      return;
    }
    
    // if not authenticated
    if (!isAuthenticated()) {
      console.log("Not authenticated - redirect login");
      router.push('/login');
    }
  }

  return <>{children}</>;
}