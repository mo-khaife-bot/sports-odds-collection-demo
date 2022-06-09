import React, { useState } from "react";
// "babel-preset-react-app": "*" in json

import { PatchMinus } from "react-bootstrap-icons";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

import { calculateOdds, getDate, filterTeam } from "../utils/utils";

import "../style/SportsCard.scss";
import { icons } from "./Constant";

const SportsGame = ({ sportsGame, onSeeMoreOdds }) => {
  return (
    <>
      <Card className="sports-card">
        <Card.Body>
          <Row>
            <Card.Subtitle className="mb-2 text-muted">
              Game Date: {getDate(sportsGame.commence_time)}
            </Card.Subtitle>

            <Card.Body>
              {sportsGame.bookmakers[0].markets?.map((game, key) => {
                return (
                  <Card.Body key={key}>
                    {game.outcomes?.map((thing, key) => {
                      return (
                        // chained ternary operator allows to identify 2 teams and draw
                        <Card.Text key={key}>
                          {key === 0 ? (
                            <>
                              <Image
                                className="sports-card__image"
                                src={icons[filterTeam(thing.name)]}
                                rounded
                              />
                              {thing.name} : {calculateOdds(thing.price)}
                            </>
                          ) : key === 1 ? (
                            <>
                              <Image
                                className="sports-card__image"
                                src={icons[filterTeam(thing.name)]}
                                rounded
                              />
                              {thing.name} : {calculateOdds(thing.price)}
                            </>
                          ) : (
                            <>
                              <PatchMinus
                                className="sports-card__draw"
                                size={25}
                              />
                              {thing.name} : {calculateOdds(thing.price)}
                            </>
                          )}
                        </Card.Text>
                      );
                    })}{" "}
                    <Card.Text>
                      <React.Fragment>
                        Powered By{" "}
                        <strong>{sportsGame.bookmakers[0].key}</strong>
                      </React.Fragment>

                      <Button
                        className="sports-card__see-more-odds"
                        variant="link"
                        onClick={() => onSeeMoreOdds(sportsGame)}
                      >
                        See more odds
                      </Button>
                    </Card.Text>
                  </Card.Body>
                );
              })}
            </Card.Body>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default SportsGame;
