import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { ServerStyleSheets } from '@material-ui/styles';

class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = async ctx => {
  const sheets = new ServerStyleSheets();
  const sheet = new ServerStyleSheet();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => {
        return sheet.collectStyles(sheets.collect(<App {...props} />));
      }
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        {sheets.getStyleElement()}
        {sheet.getStyleElement()}
      </>
    )
  };
};

export default MyDocument;
