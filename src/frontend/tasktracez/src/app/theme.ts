import { extendTheme } from '@chakra-ui/react';
import { Anton, Bebas_Neue, Roboto } from 'next/font/google';

const anton = Anton({
    weight: ['400'],
    subsets: ['latin', 'latin-ext']
})

const theme = extendTheme({
    fonts: {
        heading: anton.style.fontFamily,
        body: anton.style.fontFamily,
    },
});

export default theme;