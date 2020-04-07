import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { StylesProvider } from '@material-ui/styles';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import muiTheme from 'core/theme/theme';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <StylesProvider injectFirst>
        <MuiThemeProvider theme={muiTheme}>
          <ThemeProvider theme={muiTheme}>
            <Head>
              <title>Doctor online</title>
              <link rel="manifest" href="/manifest.json" />
              <meta name="theme-color" content="#fff" />
              <meta name="description" content="Doctor online" />
              <meta name="apple-mobile-web-app-capable" content="yes" />
              <meta
                name="apple-mobile-web-app-status-bar-style"
                content="#fff"
              />
              <meta name="apple-mobile-web-app-title" content="Doctor online" />
              <link rel="apple-touch-icon" href="/images/icon-192.png" />
              <link
                rel="shortcut icon"
                href="/images/favicon.ico"
                type="image/png"
              />
              <link
                href="https://fonts.googleapis.com/css?family=Roboto&display=swap"
                rel="stylesheet"
              />
            </Head>
            <CssBaseline />
            <GlobalStyle />
            <Component {...pageProps} />
          </ThemeProvider>
        </MuiThemeProvider>
      </StylesProvider>
    );
  }
}

export default MyApp;

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 14px;
  }

  body {
      font-family: 'Roboto';
      font-size: 1rem;
    }
`;
