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
  const [loading, setLoading] = useState(false);

  // const [team1Details, setTeam1Details] = useState({
  //   name: "",
  //   price: "",
  // });
  // const [team2Details, setTeam2Details] = useState({
  //   name: "",
  //   price: "",
  // });
  // const [drawDetails, setDrawDetails] = useState({
  //   name: "",
  //   price: "",
  // });

  useEffect(() => {
    const getData = async (key) => {
      try {
        setLoading(true);
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
        } else {
          // ? I would set state of names here but as I have to loop in nested map() this would be very difficult
          setLoading(true);

          return setOdds({ ...odds, soccer_epl: response.data });
        }
      } catch (error) {
        setError(true);
        setOdds({});
      }
    };
    getData(activeSport);
  }, []);

  // useEffect(() => {
  //   const gameDetails = async (response) => {
  //     response[activeSport] &&
  //       response[activeSport].map((sportsGame) =>
  //         sportsGame.bookmakers.markets?.map((game) =>
  //           game.outcomes?.map((thing) =>
  //             key === 0
  //               ? setTeam1Details((oldState) => ({
  //                   ...oldState,
  //                   name: thing.name,
  //                   price: calculateOdds(thing.price),
  //                 }))
  //               : key === 1
  //               ? setTeam2Details((oldState) => ({
  //                   ...oldState,
  //                   name: thing.name,
  //                   price: calculateOdds(thing.price),
  //                 }))
  //               : setDrawDetails((oldState) => ({
  //                   ...oldState,
  //                   name: thing.name,
  //                   price: calculateOdds(thing.price),
  //                 }))
  //           )
  //         )
  //       );
  //   };
  //   gameDetails(odds);
  // }, [odds]);

  // console.log("odds + bookmakers::: ", odds);
  // console.log("home: ", team1Details);
  // console.log("away: ", team2Details);
  // console.log("draw: ", drawDetails);

  if (!odds) {
    return null;
  }

  const onSeeMoreOdds = (game) => {
    setActiveGame(game);
    setModalShow(true);
  };

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
                <a href="https://github.com/MuhammadAli-ai">Mo Khaife Ali</a>👨🏾‍💻
              </h6>
              {sportsList.map((sport) => {
                return (
                  <ListGroup.Item
                    key={sport.key}
                    as="button"
                    onClick={() => setActiveSport(sport.key)}
                    active={activeSport === sport.key}
                  >
                    {sport.view}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>{" "}
          {!loading ? (
            <h5>Sports Odd API is Loading.....</h5>
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
                    <div>No sports yet</div>
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
