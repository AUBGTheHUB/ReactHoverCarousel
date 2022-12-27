import React, { useRef } from "react";
import { Event, Article, Custom } from "./card_definitions";
import "./carousel.css";
import { Card } from "./Card";
import { FaArrowCircleLeft } from "react-icons/fa";
import { useState } from "react";
import { SLIDING_PIXELS, CARDS_MARGIN } from "./constants";
import { useMediaQuery } from "react-responsive";

type Props = {
  cards: Event[] | Article[] | Custom[];
  buttonColor?: string;
  backgroundColor?: string;
};

enum SlidingAnimation {
  Left = "slideLeft 1s",
  Right = "slideRight 1s",
}

export const Carousel = ({
  cards,
  buttonColor = "black",
  backgroundColor = "yellow",
}: Props) => {
  const [position, setPosition] = useState(0);
  const [animation, setAnimation] = useState("none");

  const isDesktop = useMediaQuery({ query: "(min-width: 1000px)" });

  const [currentIndex, setCurrentIndex] = useState(isDesktop ? 3 : 0); // starts with 4 images

  const [leftButton, setLeftButton] = useState({
    css: "arrow disabled",
    canClick: false,
  });

  const [rightButton, setRightButton] = useState({
    css: "arrow right",
    canClick: true,
  });

  const animationRunning = useRef(false);

  const SLIDING_WINDOW_LENGTH = cards.length * SLIDING_PIXELS;


  const slideLeft = (event: React.MouseEvent<SVGAElement>) => {
    if (animationRunning.current ) return;

    if (rightButton.canClick) {
      animationRunning.current = true;
      setPosition(position - SLIDING_PIXELS);
      setAnimation(SlidingAnimation.Left);

      setLeftButton({ css: "arrow", canClick: true });

      setTimeout(() => {
        animationRunning.current = false;
      }, 750);
      

      if (
        currentIndex + 1 === cards.length - 1
      ) {
        setRightButton({ css: "arrow right disabled", canClick: false });
      } else {
        setRightButton({ css: "arrow right", canClick: true });
        setCurrentIndex(currentIndex + 1)
      }
    }
  };

  const slideRight = (event: React.MouseEvent<SVGAElement>) => {
    if (animationRunning.current) return;

    if (leftButton.canClick) {
      animationRunning.current = true;
      setPosition(position + SLIDING_PIXELS);
      setAnimation(SlidingAnimation.Right);

      setRightButton({ css: "arrow right", canClick: true });

      setTimeout(() => {
        animationRunning.current = false;
      }, 750);

      if (-position - (SLIDING_PIXELS + CARDS_MARGIN * 2) <= 0) {
        setLeftButton({ css: "arrow disabled", canClick: false });
      } else {
        setLeftButton({ css: "arrow", canClick: true });
      }
    }
  };

  return (
    <div
      className="event-carousel-container"
      style={{ backgroundColor: `${backgroundColor}` }}
    >
      <FaArrowCircleLeft
        className={leftButton.css}
        onClick={slideRight}
        style={{ color: `${buttonColor}` }}
      />
      <div className="event-carousel-map">
        <div
          className="event-carousel-map moving"
          style={{ left: `${position}px`, animation: animation }}
          key={Math.random()}
        >
          {cards.map((card, index) => (
            <Card prop={card} key={index} />
          ))}
        </div>
      </div>
      <FaArrowCircleLeft
        className={rightButton.css}
        onClick={slideLeft}
        style={{ color: `${buttonColor}` }}
      />
    </div>
  );
};
