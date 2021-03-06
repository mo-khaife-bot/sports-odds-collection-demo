import React from "react";

import Modal from "react-bootstrap/Modal";

import Table from "react-bootstrap/Table";
import Image from "react-bootstrap/Image";
import { icons } from "./Constant";

import { filterTeam, calculateOdds } from "../utils/utils";

import "../style/OddsModal.scss";

const OddsModal = ({ onHide, show, activeGame }) => {
  if (!activeGame) {
    return null;
  }

  return (
    <Modal
      className="odds-modal"
      onHide={onHide}
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        {/* First MAP: to get club logos and associated names for Modal Title */}
        {activeGame.bookmakers[0].markets?.map((game, idx) => {
          return (
            <Modal.Title key={idx} id="contained-modal-title-vcenter">
              {game.outcomes?.map((outcome, idx) => {
                console.log("OUTCOME :::", outcome);
                return (
                  <React.Fragment key={idx}>
                    {/* Conditional rendering below is so that in modal title draw doesn't appear only important in sports where draw is possible like soccer */}
                    {outcome.name != "Draw" && (
                      <>
                        <Image
                          className="odds-modal__image"
                          src={icons[filterTeam(outcome.name)]}
                          rounded
                        />{" "}
                        {outcome.name}
                        {"        "}
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </Modal.Title>
          );
        })}
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover size="sm">
          <thead>
            {/* 2nd Map: to get Modal Table Headers */}
            {activeGame.bookmakers[0].markets?.map((game, idx) => (
              <tr key={idx}>
                <th>Sportsbook</th>
                {game.outcomes?.map((outcome, idx) => (
                  <React.Fragment key={idx}>
                    <th>{outcome.name}</th>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {/* 3rd Map: To get betting odd makers names and odds for respective teams */}
            {activeGame.bookmakers?.map((site) => (
              // get the name of the betting agents
              <React.Fragment key={site.key}>
                <tr key={site.key}>
                  <td>{site.key}</td>
                  {site.markets?.map((game, idx) => (
                    <React.Fragment key={idx}>
                      {/* some game.key is 'h2hlay' so only want 'h2h' */}
                      {game.key === "h2h" && (
                        <>
                          {game.outcomes?.map((outcome, idx) => (
                            <React.Fragment key={idx}>
                              <td key={idx}>{calculateOdds(outcome.price)}</td>
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

export default OddsModal;
