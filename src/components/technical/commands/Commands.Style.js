import styled from "styled-components";

import THEME from "../../../theme/Theme";

const style = (Component) => styled(Component)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  height: 2.5rem;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.2rem;
  z-index: 1000;
  // background-color: var(--color-homepage-bg);
  min-width: 200px;

  animation-duration: 1.75s;
  animation-delay: 0.5s;
  animation-fill-mode: backwards;
  animation-name: animate-glow;
  animation-timing-function: ease;

  @keyframes animate-glow {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  svg {
    //transition: stroke 0.5s ease;
    width: 2rem;
    stroke: var(--color-background);
    stroke-width: 1.3;
    padding: 0.4rem;

    &.recording-on {
      stroke: var(--color-error);
      fill: var(--color-error);
      :hover {
        //fill: var(--color-error);
        stroke: var(--color-error);
      }
    }

    &.audio-on {
      stroke: var(--color-error);
    }

    &.screen-sharing-on {
      stroke: var(--color-error);
    }

    &.video-on {
      stroke: var(--color-error);
    }
  }

  @media screen and (min-width: ${THEME.breakpoints[0]}) {
    bottom: 4rem;

    svg {
      width: 3rem;
    }
  }

  svg:hover {
    //background: var(--color-error);
    stroke: var(--color-decorative);
    stroke-width: 1.3px;
    border-radius: 10%;
  }
`;

export default style;
