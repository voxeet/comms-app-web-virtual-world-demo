import styled from "styled-components";

const style = (Component) => styled(Component)`
  height: 100%;
  width: 100%;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;

  h1 {
    font-size: 5rem;
    margin: 0;
    font-family: MyFont;
    font-weight: 200;
    padding-bottom: 1rem;
  }

  a {
    pointer-events: all;
    position: absolute;
    top: 40px;
    left: 40px;
    color: var(--color-background);
    text-decoration: none;
  }

  .instructions {
    color: var(--color-background);
    position: absolute;
    top: 40px;
    left: 40px;
    .controls {
      font-size: 1rem;
    }

    .controls-content {
      margin: 0;
    }
  }

  a.right {
    left: unset;
    right: 40px;
  }

  h2 {
    opacity: 0.4;
    margin-top: 1em;
    text-align: center;
    font-weight: 400;
    font-size: 0.9em;
    line-height: 1.4em;
    letter-spacing: 2px;
  }
`;

export default style;
