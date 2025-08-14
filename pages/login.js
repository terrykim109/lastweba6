"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, authenticateUser } from "@/lib/authenticate"; 
import { useAtom } from "jotai";
import { favouritesAtom, searchHistoryAtom } from "@/store";
import { getFavourites, getHistory } from "@/lib/userData";
import { Alert, Button, Card, Form } from "react-bootstrap";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuth(); 

  async function updateAtoms() {
    try {
      console.log("[updateAtoms] Starting atom update...");
      const favourites = await getFavourites();
      const history = await getHistory();

      setFavouritesList(favourites);
      setSearchHistory(history);
      console.log("Updated!");
    } catch (err) {
      console.error("Errors with atoms:", err);
      throw new Error("Failed to load user data: " + err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Form submit!");
    setIsLoading(true);
    setWarning("");

    try {
      // using authenticateUser, gives token string
      const token = await authenticateUser(user, password);

      setToken(token); 
      await updateAtoms();
      router.push("/favourites");
    } catch (err) {
      console.error("Errors are:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });

      let userMessage = err.message || "Login failed. Please check your username and password.";

      setWarning(userMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mt-5 pt-5">
      <Card>
        <Card.Body>
          <h2>Login</h2>
          <p>Log in to your account:</p>
          {warning && (
            <Alert variant="danger" onClose={() => setWarning("")} dismissible>
              {warning}
              <div className="mt-2 text-muted small">
                Incorrect ID, try again.
              </div>
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
                disabled={isLoading}
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}