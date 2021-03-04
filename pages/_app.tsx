import { createStore, applyMiddleware, combineReducers } from "redux";
import { createGlobalStyle } from 'styled-components';
import { Provider } from "react-redux";
import Head from "next/head";
import Axios from "axios";
import axiosMiddleware from 'redux-axios-middleware';

import 'tippy.js/dist/tippy.css';
import { Theme } from "../utils/theme";
import { rootReducer } from "../store/rootReducer";

const client = Axios.create({ //all axios can be used, shown in axios documentation
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api/v1' : 'https://pokemon.maybreak.com/api/v1',
  responseType: 'json',
  withCredentials: true,
});


const store = createStore(rootReducer, applyMiddleware(axiosMiddleware(client)));

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
        <Head>
          <title>Pokemon Viewer</title>
        </Head>
      <GlobalStyles />
      <Component {...pageProps} />
    </Provider>
  );
}

export default App


const GlobalStyles = createGlobalStyle`
  html {
    font-size: 16px;
    -webkit-font-smoothing: subpixel-antialiased;
  }

  body {
    font-family: 'Assistant', sans-serif;
    margin: 0;
    background-color: #f0f0f0;
    min-height: 100vh;

    @media screen and (max-width: ${Theme.mobileThreshold}) {
      background-color: #841383;
    }
  }

  body > div:first-child {
    min-height: 100vh;
  }

  * {
    box-sizing: border-box;
  }
`;