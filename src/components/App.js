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
  const [activeSport, setActiveSport] = useState("baseball_mlb");
  const [activeGame, setActiveGame] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [rateLimit, setRateLimit] = useState(false);

  // set state for isLoading for spinner
  const [isLoading, setIsLoading] = useState(false);

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
        } else {
          setIsLoading(true);
          if (activeSport === "soccer_epl") {
            setOdds({ ...odds, soccer_epl: response.data });
            // setIsLoading(false); // Hide loading screen
          } else if (activeSport === "basketball_nba") {
            setOdds({ ...odds, basketball_nba: response.data });
            // setIsLoading(false); // Hide loading screen
          } else if (activeSport === "americanfootball_nfl") {
            setOdds({ ...odds, americanfootball_nfl: response.data });
            // setIsLoading(false); // Hide loading screen
          } else if (activeSport === "icehockey_nhl") {
            setOdds({ ...odds, icehockey_nhl: response.data });
            // setIsLoading(false); // Hide loading screen
          } else if (activeSport === "baseball_mlb") {
            setOdds({ ...odds, baseball_mlb: response.data });
            // setIsLoading(false); // Hide loading screen
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

  console.log("odds :::", odds);
  console.log("ACTIVE SPORT :::::", odds[activeSport]);

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
                <a href="https://github.com/mo-khaife-bot/sports-odds-collection-demo">
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
          <Col xs={12} md={10}>
            {/* conditional rendering with layers of Ternary operators 
            FIRST LAYER -if rate limit reached stops there */}
            {rateLimit ? (
              <h5>
                Rate Limit for Sports Odd API has been reached please check back
                after the 5th of next month to refresh.
              </h5>
            ) : // still first  layer checks if error is thrown
            error ? (
              <h5>
                Sports Odd API is not available....Please check in later 🤎
              </h5>
            ) : // Start of SECOND LAYER of ternary operator
            // checking if the odds[ActiveSports] array is empty
            // how to incorporate loading when odds[ActiveSports] is not present allowing for spinner and no odds[ActiveSports] i.e when no odds data and season is over POSSIBLY DESIGN FLAW have sacrified spinner to display season is over message
            // checks to see if length of array 0 means no odds out of season
            !odds[activeSport]?.length > 0 ? (
              <h5>
                No odds for that sport - the season is over pick another sport
                .... or check-back when the sport is back in Season 🤎
              </h5>
            ) : (
              // end of second layer runs whole code below which has nested ternary
              <Row>
                {/* below checks that API data for that sport has been pulled or has loading spinner if not */}
                {odds[activeSport] ? (
                  odds[activeSport].map((sportsGame) => {
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
