import styled from "styled-components";

const style = (Component) => styled(Component)`
  button {
    position: absolute;
    right: -0.3em;
    top: -0.3em;
    float: right;
    font-weight: 100;
    color: var(--color-text);
    outline: none;
    border: none;
    text-shadow: 0 1px 0 #fff;
    opacity: 0.8;
    line-height: 1;
    font-size: 16px;
    padding: 0;
    cursor: pointer;
    background: 0 0;
    border: 0;
  }

  font-size: 14px;
  box-sizing: border-box;
  position: fixed;
  z-index: 999999;

  top: 12px;
  right: 12px;
  transition: transform 0.6s ease-in-out;
  animation: toast-in-right 0.7s;

  .notification {
    position: relative;
    display: flex;
    justify-content: flex-start;
    padding-left: 8px;
    align-items: center;
    height: 60px;
    top: 12px;
    right: 12px;
    transition: transform 0.6s ease-in-out;
    animation: toast-in-right 0.7s;

    background: var(--color-background);

    pointer-events: auto;
    overflow: hidden;
    margin: 0 0 6px;
    margin-bottom: 15px;
    width: 320px;
    max-height: 100px;
    border-radius: 3px 3px 3px 3px;
    box-shadow: 0 0 10px #999;
    color: var(--color-text);
    opacity: 0.9;
    background-position: 15px;
    background-repeat: no-repeat;
  }

  .notification-data-container {
    padding: 4px;
  }

  .notification:hover {
    box-shadow: 0 0 8px #fff;
    opacity: 1;
    cursor: pointer;
  }

  .notification-title {
    font-weight: 700;
    font-size: 16px;
    text-align: left;
    margin-top: 0;
    margin-bottom: 6px;
    height: 18px;
  }

  .notification-message {
    margin: 0;
    text-align: left;
    height: 18px;
    margin-left: -1px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export default style;
