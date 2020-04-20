import React, { Component } from 'react';
import cookies from 'next-cookies';
import { Router } from 'next/router';

export default function withAuth(AuthComponent) {
  return class Authenticated extends Component {
    static async getInitialProps(ctx) {
      const { token } = cookies(ctx);

      if (!token) {
        if (ctx.res) {
          ctx.res.writeHead(302, {
            Location: 'http://localhost:8080/patient/auth'
          });
          ctx.res.end();
        } else {
          Router.push('/patient/auth');
        }
      }
      // Check if Page has a `getInitialProps`; if so, call it.
      const pageProps =
        AuthComponent.getInitialProps &&
        (await AuthComponent.getInitialProps(ctx));
      // Return props.
      return { ...pageProps, token: null };
    }

    render() {
      return <AuthComponent {...this.props} />;
    }
  };
}
