import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import { createGlobalStyle } from "styled-components";
import { createReduxHistoryContext } from "redux-first-history";
import { createWouterHook } from "redux-first-history/wouter";
import * as Wouter from "wouter";

import App from "./App";
import configureStore from "./store/store";
import THEME from "./theme/Theme";
import ThemeProvider from "./components/technical/themeProvider/ThemeProvider";
import LibreBarcode128Text from "./assets/LibreBarcode128Text-Regular.ttf";

const setDefaultColors = (variant = "dark") => {
  return Object.entries(THEME.colors[variant]).reduce((accu, [rule, value]) => {
    return `${rule}:${value}; ${accu}`;
  }, "");
};

const setFonts = () => {
  const strings = Object.entries(THEME.font).map(([_, category]) => {
    return Object.entries(category).reduce((accu, [rule, value]) => {
      return `${rule}:${value}; ${accu}`;
    }, "");
  });
  return strings.join(";");
};

const GlobalStyle = createGlobalStyle`
  body {
    font-family: "Open Sans", sans-serif;  
    margin: 0;
    
    *, *:before, *:after {
        box-sizing: border-box;
    }  
  }

  @font-face {
    font-family: MyFont;
    src: url('${LibreBarcode128Text}') format('opentype');
  }
  
  :root{  
    ${setDefaultColors()};    
    ${setFonts()}; 
  }
  
  #root{      
    height:100vh;   
    background-color: var(--color-background);     
  }
  
  button {
    color: var(--color-background);
    font-size: 1em;
    margin: 1em;
    padding: 0.6em 1em;
    border-radius: 30px;
    background-color: var(--color-primary);
    border: none;
    outline: none;
    &:hover {
      background-color: var(--color-error);
    }
  }
`;

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({
    history: createBrowserHistory(),
    reduxTravelling: "yes",
  });

export const createStore = ({
  initialState = {},
  routerReducer,
  routerMiddleware,
}) => {
  return configureStore(initialState, routerReducer, routerMiddleware);
};

const store = createStore({
  initialState: {},
  routerReducer,
  routerMiddleware,
});

const history = createReduxHistory(store);

const wouterUseLocation = createWouterHook(history);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={THEME}>
      <Provider store={store}>
        <Wouter.Router hook={wouterUseLocation}>
          <App />
        </Wouter.Router>
      </Provider>
      <GlobalStyle />
    </ThemeProvider>
  </React.StrictMode>
);
