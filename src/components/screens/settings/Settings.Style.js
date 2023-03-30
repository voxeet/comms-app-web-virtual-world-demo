import styled from "styled-components";

const style = (Component) => styled(Component)`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 5rem;
  justify-content: center;

  .device-type {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .device {
    :hover {
      color: var(--color-primary);
    }
    &.current {
      color: var(--color-primary);
    }
  }
`;

export default style;
