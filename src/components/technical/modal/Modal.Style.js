import styled from "styled-components";

const style = (Component) => styled(Component)`
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1040;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    opacity: 0.5;
  }

  .modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1050;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    outline: 0;
    display: flex;
    place-items: center;
    padding: 1rem 1rem 1rem;
  }

  .modal {
    position: relative;
    z-index: 100;
    background: white;
    border-radius: 0.6rem;

    display: flex;
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    > svg {
      position: absolute;
      top: 1rem;
      right: 1rem;
      stroke: var(--color-primary);
    }
  }
`;

export default style;
