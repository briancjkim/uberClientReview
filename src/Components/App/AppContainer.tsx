import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { graphql } from 'react-apollo';
import { IS_LOGGED_IN } from './AppQueries';
import AppPresenter from './AppPresenter';
import { ThemeProvider } from '../../typed-components';
import theme from '../../theme';
import GlobalStyle from '../../global-styles';

const AppContainer = ({ data }) => (


  <ThemeProvider theme={theme}>
    <React.Fragment>
      <GlobalStyle />
      <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
      <ToastContainer draggable={true} position={"bottom-center"} />
    </React.Fragment>

  </ThemeProvider>

);

export default graphql(IS_LOGGED_IN)(AppContainer);