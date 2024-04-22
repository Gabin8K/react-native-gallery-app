import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');


const common = {
  error: '#f44336',
  info: '#2196F3',
  notification:'#FF4500',
}

export const light = {
  primary: '#000',
  secondary: '#fff',
  background: '#fff',
  text: '#000',
  textLight: '#666',
  border: '#ccc',
  card : '#f0f0f0',
  ...common,
};

export const dark = {
  primary: '#FFD700',
  secondary: '#FFA500',
  background: '#121212',
  text: '#FFF',
  textLight: '#aaa',
  border: '#555',
  card: '#444',
  ...common,
};

export const space = {
  container : 16,
  width,
  height
}


export const lightTheme = {
  dark: false,
  colors: light,
  space,
}

export const darkTheme = {
  dark: true,
  colors: dark,
  space,
}

const theme = {
  lightTheme,
  darkTheme
}

export default theme;