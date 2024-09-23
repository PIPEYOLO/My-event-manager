import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers';
import tailwindConfig from '../../../../../tailwind.config';

const theme = createTheme({
  palette: {
    primary: {
      main: tailwindConfig.theme.extend.colors[6], 
      
    },
    text: {
      primary: tailwindConfig.theme.extend.colors[6], 
      secondary: tailwindConfig.theme.extend.colors[6]
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: tailwindConfig.theme.extend.colors[6], 
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: tailwindConfig.theme.extend.colors[6], 
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: tailwindConfig.theme.extend.colors[6], 
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: tailwindConfig.theme.extend.colors[6], 
          '&.Mui-focused': {
            color: tailwindConfig.theme.extend.colors[6],
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fill: tailwindConfig.theme.extend.colors[6]
        },
      },
    },
  },
  
});


export default function MainDateTimePicker({ label, value, onChange }) {
  return (
    <ThemeProvider theme={ theme }>
      <DateTimePicker
        label={ label }
        value={ value }
        onChange={ onChange }
      />
    </ThemeProvider>
  )
}

