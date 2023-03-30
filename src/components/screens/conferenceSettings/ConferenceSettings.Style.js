import styled from "styled-components";

const style = (Component) => styled(Component)`
  background: linear-gradient(155deg, #ffffff 20%, #a5a3a3);
  color: #101015;
  height: 100%;
  width: 100%;
  position: relative;
  top: 0;
  left: 0;

  .form {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: center;
    padding: 40px;

    > form {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
  }

  h1 {
    position: absolute;
    top: 40px;
    left: 40px;
    color: #101015;
    font-size: 5rem;
    margin: 0;
    font-family: MyFont;
    font-weight: 200;
  }

  a {
    pointer-events: all;
    position: absolute;
    top: 40px;
    left: 40px;
    color: #101015;
    text-decoration: none;
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

  input {
    text-align: center;
    width: 50%;
    border: none;
    background-color: transparent;
    caret-shape: block;
    line-height: 1.4em;
    letter-spacing: 2px;
    outline: none;
    margin-bottom: 2rem;
    font-weight: 200;
    font-size: 1.2rem;
  }
`;

export default style;
