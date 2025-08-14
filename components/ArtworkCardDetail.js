import useSWR from "swr";
import Error from "next/error";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";

export default function ArtworkCardDetail({ objectID }) {
  const { data, error } = useSWR(
    objectID
      ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
      : null
  );

  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(favouritesList?.includes(parseInt(objectID)));
  }, [favouritesList, objectID]);

  async function favouritesClicked() {
    if (showAdded) {
      setFavouritesList(await removeFromFavourites(objectID));
    } else {
      setFavouritesList(await addToFavourites(objectID));
    }
  }

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  return (
    <div className="mt-4">
      <Card>
        {data.primaryImage && (
          <Card.Img variant="top" src={data.primaryImage} />
        )}

        <Card.Body>
          <Card.Title>{data.title ? data.title : "N/A"}</Card.Title>
          <Card.Text>
            <strong>Date:</strong> {data.objectDate ? data.objectDate : "N/A"}
            <br />
            <strong>Classification: </strong>
            {data.classification ? data.classification : "N/A"}
            <br />
            <strong>Medium:</strong> {data.medium ? data.medium : "N/A"}
            <br />
            <br />
            <strong>Artist: </strong>
            {data.artistDisplayName ? data.artistDisplayName : "N/A"}
            {data.artistWikidata_URL && (
              <>
                {" "}
                (
                <a
                  href={data.artistWikidata_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  wiki
                </a>
                )
              </>
            )}
            <br />
            <strong>Credit Line: </strong>
            {data.creditLine ? data.creditLine : "N/A"}
            <br />
            <strong>Dimensions: </strong>
            {data.dimensions ? data.dimensions : "N/A"}
          </Card.Text>
          <Button
            variant={showAdded ? "primary" : "outline-primary"}
            onClick={favouritesClicked}
          >
            {showAdded ? "+ Favourite (added)" : "+ Favourite"}
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}