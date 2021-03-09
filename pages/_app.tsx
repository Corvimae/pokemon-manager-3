import { createStore, applyMiddleware } from 'redux';
import styled, { createGlobalStyle } from 'styled-components';
import { Provider } from 'react-redux';
import Head from 'next/head';
import App, { AppContext } from 'next/app';
import Link from 'next/link';
import Axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import { Theme } from '../utils/theme';
import { rootReducer } from "../store/rootReducer";

import 'tippy.js/dist/tippy.css';

const client = Axios.create({ //all axios can be used, shown in axios documentation
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api/v1' : 'https://pokemon.maybreak.com/api/v1',
  responseType: 'json',
  withCredentials: true,
});


const store = createStore(rootReducer, applyMiddleware(axiosMiddleware(client)));

function ViewerApp({ Component, pageProps, displayName }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Pokemon Viewer</title>
      </Head>
      <GlobalStyles />
      <Container>
        <PageContents>
          <Component {...pageProps} />
        </PageContents>
        <BottomBar>
          {displayName && (
            <>
              Logged in as {displayName}.
              <Link href="/logout">
                <a>Log out</a>
              </Link>
            </>
          )}
          {!displayName && (
            <>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </>
          )}
        </BottomBar>
      </Container>
    </Provider>
  );
}

ViewerApp.getInitialProps = async (appContext: AppContext) => {
  return {
    ...(await App.getInitialProps(appContext)),
    displayName: (appContext.ctx.req as any).user?.displayName ?? null,
  }
}

export default ViewerApp


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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const PageContents = styled.div`
  min-height: 0;
  flex-grow: 1;
  align-self: stretch;
  overflow-y: auto;
`;

const BottomBar = styled.div`
  display: flex;
  bottom: 0;
  width: 100vw;
  height: 2rem;
  align-items: center;
  background-color: #333;
  color: #fff;
  padding: 0.25rem 1rem;

  & a {
    color: #fff;
    padding: 0 0.5rem;
  }
`;