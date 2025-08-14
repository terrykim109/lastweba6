//this works
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import ArtworkCard from "@/components/ArtworkCard";
import { getFavourites } from "@/lib/userData";

export default function Favourites() {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [loading, setLoading] = useState(true);

  // HYDRATE ATOM FROM API ON COMPONENT MOUNT
  useEffect(() => {
    const hydrateFavourites = async () => {
      try {
        const saved = await getFavourites();
        console.log("Loaded favourites from API:", saved);
        if (Array.isArray(saved)) {
          setFavouritesList(saved);
        } else {
          // Ensure favouritesList is an empty array even if API returns no data
          setFavouritesList([]);
        }
      } catch (err) {
        console.error("Failed to load favourites:", err);
        setFavouritesList([]); // Set to empty array on error as well
      } finally {
        setLoading(false);
      }
    };
    hydrateFavourites();
  }, [setFavouritesList]); // The useEffect now depends on setFavouritesList

  // Display a loading message while waiting for the API call
  if (loading) {
    return (
      <Col>
        <Card className="mt-4 mx-auto" style={{ textAlign: "center" }}>
          <Card.Body>
            <Card.Title>
              <h4>Loading Favourites...</h4>
            </Card.Title>
          </Card.Body>
        </Card>
      </Col>
    );
  }

  // Once loading is complete, display the correct content
  return (
    <Row className="gy-4 mt-1">
      {favouritesList.length > 0 ? (
        favouritesList.map((objectID) => (
          <Col lg={3} key={objectID}>
            <ArtworkCard objectID={objectID} />
          </Col>
        ))
      ) : (
        <Col>
          <Card className="mt-4 mx-auto" style={{ textAlign: "center" }}>
            <Card.Body>
              <Card.Title>
                <h4>Nothing Here</h4>
              </Card.Title>
              <Card.Text>Try adding some new artwork to the list.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      )}
    </Row>
  );
}