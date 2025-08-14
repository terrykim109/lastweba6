import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Navbar, Nav, Container, NavDropdown, Form } from "react-bootstrap";
import { useAtom } from "jotai";
import { searchHistoryAtom, tokenAtom } from "@/store";
import { getToken, readToken, removeToken } from "@/lib/authenticate";
import { addToHistory } from "@/lib/userData"; 

export default function MainNav() {
  const [searchField, setSearchField] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [favouritesCount, setFavouritesCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const [userName, setUserName] = useState("");

  const [token, setToken] = useAtom(tokenAtom); // using jotai for authentication state
  const isAuthenticated = token !== null;

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      const payload = readToken();
      if (payload) {
        setUserName(payload.userName);

        // fetching favs
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/favourites`, {
          headers: { 
            Authorization: `Bearer ${getToken()}` 
          },
        })
          .then((res) => res.json())
          .then((data) => setFavouritesCount(Array.isArray(data) ? data.length : 0))
          .catch(() => setFavouritesCount(0));

        // fetching history
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/history`, {
          headers: { 
            Authorization: `Bearer ${getToken()}` 
          },
        })
          .then((res) => res.json())
          .then((data) => setHistoryCount(Array.isArray(data) ? data.length : 0))
          .catch(() => setHistoryCount(0));
      }
    } else {
      setUserName("");
      setFavouritesCount(0);
      setHistoryCount(0);
    }
  }, [token, isAuthenticated]);

  // for logout
  const logout = () => {
    setIsExpanded(false);
    removeToken();
    setToken(null);
    router.push("/login");
  };

  // for search
  const submitForm = async (e) => {
    e.preventDefault();
    if (!searchField.trim()) return;
    
    const queryString = `title=true&q=${searchField}`;
    
    try {
      if (isAuthenticated) {
        const updatedHistory = await addToHistory(queryString);
        setSearchHistory(updatedHistory);
      } else {
        // update local state when not authenticated
        setSearchHistory([...searchHistory, queryString]);
      }
      
      router.push(`/artwork?${queryString}`);
      setIsExpanded(false);
      setSearchField(""); 
    } catch (error) {
      console.error("Failed to save search history:", error);
    }
  };

  return (
    <Navbar className="fixed-top navbar-dark bg-primary" expanded={isExpanded} expand="lg">
      <Container>
        <Navbar.Brand>Terry Kim</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" onClick={() => setIsExpanded(!isExpanded)} />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Link href="/" passHref legacyBehavior>
              <Nav.Link active={router.pathname === "/"} onClick={() => setIsExpanded(false)}>
                Home
              </Nav.Link>
            </Link>

            {isAuthenticated && (
              <Link href="/search" passHref legacyBehavior>
                <Nav.Link active={router.pathname === "/search"} onClick={() => setIsExpanded(false)}>
                  Advanced Search
                </Nav.Link>
              </Link>
            )}
          </Nav>

          {isAuthenticated && (
            <Form className="d-flex" onSubmit={submitForm}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
              />
              <button className="btn btn-success" type="submit">
                Search
              </button>
            </Form>
          )}

          <Nav>
            {!isAuthenticated ? (
              <>
                <Link href="/register" passHref legacyBehavior>
                  <Nav.Link active={router.pathname === "/register"} onClick={() => setIsExpanded(false)}>
                    Register
                  </Nav.Link>
                </Link>
                <Link href="/login" passHref legacyBehavior>
                  <Nav.Link active={router.pathname === "/login"} onClick={() => setIsExpanded(false)}>
                    Login
                  </Nav.Link>
                </Link>
              </>
            ) : (
              <NavDropdown title={userName || "User"} id="user-dropdown" align="end">
                <Link href="/favourites" passHref legacyBehavior>
                  <NavDropdown.Item onClick={() => setIsExpanded(false)} active={router.pathname === "/favourites"}>
                    Favourites 
                  </NavDropdown.Item>
                </Link>
                <Link href="/history" passHref legacyBehavior>
                  <NavDropdown.Item onClick={() => setIsExpanded(false)} active={router.pathname === "/history"}>
                    Search History 
                  </NavDropdown.Item>
                </Link>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}