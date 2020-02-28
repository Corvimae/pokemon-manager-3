import { createStore, applyMiddleware } from "redux";
import { createGlobalStyle } from 'styled-components';
import { reducer } from "../store/store";
import { Provider } from "react-redux";
import Axios from "axios";
import axiosMiddleware from 'redux-axios-middleware';

import 'tippy.js/dist/tippy.css';

const client = Axios.create({ //all axios can be used, shown in axios documentation
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:80/api' : 'https://pokemon.maybreak.com/api',
  responseType: 'json',
  withCredentials: true,
});

const store = createStore(reducer, applyMiddleware(axiosMiddleware(client)));

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <GlobalStyles />
      <Component {...pageProps} />
    </Provider>
  );
}

export default App


const GlobalStyles = createGlobalStyle`
  html {
    font-size: 16px;
  }

  body {
    font-family: Overpass, sans-serif;
    margin: 0;
    background-color: #f0f0f0;
    min-height: 100vh;
  }

  body > div {
    min-height: 100vh;
  }

  * {
    box-sizing: border-box;
  }
`;