import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import axios from "axios";

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";

function Deck() {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    async function createDeck() {
      const res = await axios.get(`${API_BASE_URL}/new/shuffle/`);
      setDeck(res.data);
      console.log(res.data);
    }
    createDeck();
  }, [setDeck]);

  useEffect(() => {
    async function drawCard() {
      let { deck_id } = deck;
      try {
        let res = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`);
        if (res.data.remaining === 0) {
          setAutoDraw(false);
          throw new Error("No cards remaining");
        }
        const card = res.data.cards[0];
        setDrawn((c) => [
          ...c,
          {
            id: card.code,
            name: card.suit + " " + card.value,
            image: card.image,
          },
        ]);
      } catch (err) {
        alert(err);
      }
    }

    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await drawCard();
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [deck, setAutoDraw, autoDraw]);

  const toggleAutoDraw = () => {
    setAutoDraw((auto) => !auto);
    console.log(autoDraw);
  };

  const cards = drawn.map((c) => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));
  return (
    <div>
      {deck ? <button onClick={toggleAutoDraw}>Draw card</button> : null}
      <div>{cards}</div>
    </div>
  );
}

export default Deck;
