import * as styledComponents from "styled-components";

interface IThemeInterface {
  primaryColor: string;
  primaryColorInverted: string;
  yellowColor: string;
  greenColor: string;
}

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider
} = styledComponents as styledComponents.ThemedStyledComponentsModule<
  IThemeInterface
>;

export { css, createGlobalStyle, keyframes, ThemeProvider };
export default styled;
