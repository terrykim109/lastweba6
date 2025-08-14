import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { useRouter } from "next/router";
import { Card, ListGroup, Button } from "react-bootstrap";
import styles from "@/styles/History.module.css";
import { removeFromHistory } from "@/lib/userData";

export default function History() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  let parsedHistory = [];

  if (Array.isArray(searchHistory)) {
    searchHistory.forEach((h) => {
      let params = new URLSearchParams(h);
      let entries = params.entries();
      parsedHistory.push(Object.fromEntries(entries));
    });
  }

  function historyClicked(e, index) {
    router.push(`/artwork?${searchHistory[index]}`);
  }

  async function removeHistoryClicked(e, index) {
    e.stopPropagation();
    setSearchHistory(await removeFromHistory(searchHistory[index]));
  }

  return (
    <>
      {parsedHistory.length === 0 ? (
        <Card className="mt-5 mx-auto">
          <Card.Body>
            <Card.Title>Nothing Here</Card.Title>
            <Card.Text>Try searching for some artwork</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <ListGroup className="mt-4 mx-auto">
          {parsedHistory.map((historyItem, index) => (
            <ListGroup.Item
              key={index}
              onClick={(e) => historyClicked(e, index)}
              className={styles.historyListItem}
            >
              {Object.keys(historyItem).map((key) => (
                <span key={key}>
                  {key}: <strong>{historyItem[key]}</strong>&nbsp;
                </span>
              ))}
              <Button
                className="float-end"
                variant="danger"
                size="sm"
                onClick={(e) => removeHistoryClicked(e, index)}
              >
                &times;
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
}