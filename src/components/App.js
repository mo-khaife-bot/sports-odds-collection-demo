import React, { useState, useEffect } from "react";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ListGroup from "react-bootstrap/ListGroup";
import Navbar from "react-bootstrap/Navbar";
import { sportsList } from "./Constant";

import SportsGame from "./SportsGame";
import OddsModal from "./OddsModal";

import axios from "axios";

import "../style/App.scss";

function App() {
  const [odds, setOdds] = useState(null);
  const [error, setError] = useState(false);
  const [activeSport, setActiveSport] = useState("soccer_epl");
  const [activeGame, setActiveGame] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [rateLimit, setRateLimit] = useState(false);

  useEffect(() => {
    const getData = async (key) => {
      try {
        const response = await axios({
          method: "GET",
          url: `https://odds.p.rapidapi.com/v4/sports/${key}/odds`,
          params: {
            regions: "us",
            oddsFormat: "american",
            markets: "h2h",
            dateFormat: "iso",
          },
          headers: {
            "X-RapidAPI-Host": "odds.p.rapidapi.com",
            "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
          },
        });
        if (response.status !== 200) {
          throw new Error(
            `Expected status 200 ok status got: ${response.status}`
          );
          // error handling to check if rate limit reached
        } else if (response.status === 429) {
          setRateLimit(true);
        } else {
          console.log(response.status);
          if (activeSport === "soccer_epl") {
            setOdds({ ...odds, soccer_epl: response.data });
          } else if (activeSport === "basketball_nba") {
            setOdds({ ...odds, basketball_nba: response.data });
          } else if (activeSport === "americanfootball_nfl") {
            setOdds({ ...odds, americanfootball_nfl: response.data });
          } else if (activeSport === "icehockey_nhl") {
            setOdds({ ...odds, icehockey_nhl: response.data });
          } else if (activeSport === "baseball_mlb") {
            setOdds({ ...odds, baseball_mlb: response.data });
          }
        }
      } catch (error) {
        setError(true);
        setOdds({});
      }
    };
    getData(activeSport);
  }, [activeSport]);
  // dependency of activeSport so whenever this changes the api is called again with a new sport being checked

  if (!odds) {
    return null;
  }

  const onSeeMoreOdds = (game) => {
    setActiveGame(game);
    setModalShow(true);
  };

  // code below helped me filter down nested map() loops
  // const detailsTeam1 = odds[activeSport]?.map((allOdds) =>
  //     allOdds.bookmakers[0].markets.map((game) =>  { name : game.outcomes[0].name, price : game.outcomes[0].price ))
  //   )

  // const nameTeam2 = odds[activeSport]?.map((allOdds) =>
  //   allOdds.bookmakers[0].markets.map((game) => game.outcomes[1].name)
  // );

  // console.log("Team 1:: ", detailsTeam1);

  console.log("odds :::", odds);

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Sports Odds Collection</Navbar.Brand>
        </Container>
      </Navbar>

      <Container>
        <Row>
          <Col xs={12} md={2}>
            <ListGroup>
              <h6>
                Made by{" "}
                <a href="https://github.com/MuhammadAli-ai/sports-odds-collection-demo">
                  Mo Khaife Ali
                </a>
                👨🏾‍💻
              </h6>
              {sportsList.map((sport) => {
                return (
                  <ListGroup.Item
                    key={sport.key}
                    as="button"
                    onClick={() => {
                      setActiveSport(sport.key);
                      console.log("activeSport :: ", activeSport);
                    }}
                    active={activeSport === sport.key}
                    // does comparison check between the active sport currently within state compared to the sport key
                    // if they are equal then it will highlight that button
                  >
                    {sport.view}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>{" "}
          {rateLimit ? (
            <h5>
              Rate Limit for Sports Odd API has been reached please check back
              after the 5th of next month to refresh.
            </h5>
          ) : (
            <Col xs={12} md={10}>
              {error ? (
                <h5>
                  Sports Odd API is not available....Please check in later 🤎
                </h5>
              ) : (
                <Row>
                  {odds[activeSport] ? (
                    odds[activeSport]?.map((sportsGame) => {
                      return (
                        <Col
                          key={sportsGame.id}
                          xs={12}
                          md={4}
                          className="mb-3 sports-grid-divider"
                        >
                          <SportsGame
                            sportsGame={sportsGame}
                            onSeeMoreOdds={onSeeMoreOdds}
                          />
                        </Col>
                      );
                    })
                  ) : (
                    <div className="loadText">
                      Loading...<div className="loader"></div>
                    </div>
                  )}
                </Row>
              )}
            </Col>
          )}
        </Row>
      </Container>
      <OddsModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        activeGame={activeGame}
      />
    </>
  );
}

export default App;
