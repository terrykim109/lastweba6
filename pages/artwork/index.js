import { useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Row, Col, Card, Pagination } from "react-bootstrap";
import ArtworkCard from "@/components/ArtworkCard";
import useSWR from "swr";
import Error from "next/error";
import validObjectIDList from "@/public/data/validObjectIDList.json";

const PER_PAGE = 12; // constant number per page

export default function Artwork() {
  const [artworkList, setArtworkList] = useState();
  const [page, setPage] = useState(1); // default value is 1
  const router = useRouter();
  let finalQuery = router.asPath.split("?")[1];

  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`
  );

  // decreasing page value from clicking previous
  function previousPage() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  // increasing page value from clicking next
  function nextPage() {
    if (page < artworkList.length) {
      setPage(page + 1);
    }
  }

  useEffect(() => {
    // when data is not null or undefined
    if (data) {
      if (data?.objectIDs?.length > 0) {

        let filteredResults = validObjectIDList.objectIDs.filter((x) =>
          data.objectIDs?.includes(x)
        ); // filter search results
        const results = [];

        // using filtered results instead
        for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
          const chunk = filteredResults.slice(i, i + PER_PAGE);
          results.push(chunk);
        }

        setArtworkList(results);
      }
      // if search -> no results
      else {
        setArtworkList([]); //set empty array
      }
      setPage(1); // page value set to 1
    }
  }, [data]);

  // if error happens during swr request
  if (error) return <Error statusCode={404} />;

  // if swr request doesn't return artworkList data
  if (!artworkList) return null;

  return (
    <>
      <Row className="gy-4 mt-1">
        {artworkList.length > 0 ? (
          // look thru all art works in artworkList
          artworkList[page - 1].map((currentObjectID) => (
            //for each id, column artwork card
            <Col lg={3} key={currentObjectID}>
              <ArtworkCard objectID={currentObjectID} />
            </Col>
          ))
        ) : (
          <Col>
            <Card className="mt-4 mx-auto">
              <Card.Body>
                <Card.Title>
                  <h4>Nothing Here</h4>
                </Card.Title>
                <Card.Text>Try searching for something else.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* if length of artworkList is greater than 0, rendering Row component with a single column of pagination components */}
      {artworkList.length > 0 && (
        <Row className="mt-4">
          <Col>
            <Pagination>
              <Pagination.Prev onClick={previousPage} />
              <Pagination.Item active>{page}</Pagination.Item>
              <Pagination.Next onClick={nextPage} />
            </Pagination>
          </Col>
        </Row>
      )}
    </>
  );
}
