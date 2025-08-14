"use client";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { getFavourites, getHistory } from '@/lib/userData';
import { isAuthenticated } from '@/lib/authenticate';

const PUBLIC_PATHS = ['/login', '/register'];

export default function RouteGuard({ children }) {
  const router = useRouter();
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [, setSearchHistory] = useAtom(searchHistoryAtom);

  useEffect(() => {
    
    updateAtoms();
    
    // Check authentication
    authCheck(router.pathname);
  }, []);

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