import { createTheme, type MantineColorsTuple } from '@mantine/core';

const coral: MantineColorsTuple = [
  '#fdf1ed',
  '#fbe0d7',
  '#f5bfac',
  '#ee9c7e',
  '#e87d56',
  '#e3693c',
  '#d9694d',
  '#b64d37',
  '#a3432f',
  '#8f3625',
];

const ink: MantineColorsTuple = [
  '#eef1f2',
  '#d3dade',
  '#b4c0c6',
  '#8fa1aa',
  '#637178',
  '#4a5a69',
  '#3a4a56',
  '#293742',
  '#1f2b34',
  '#17252d',
];

export const theme = createTheme({
  primaryColor: 'coral',
  colors: { coral, ink },
  defaultRadius: 'sm',
  fontFamily: "'Merriweather', Georgia, serif",
  headings: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontWeight: '600',
  },
  shadows: {
    md: '0 18px 45px rgba(23, 37, 45, 0.11)',
  },
  components: {
    Button: {
      defaultProps: { radius: 'xl' },
    },
    Badge: {
      defaultProps: { radius: 'xl' },
    },
    Card: {
      defaultProps: { radius: 'sm' },
    },
  },
});
