import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

// const MyPreset = definePreset(Aura, {
//     semantic: {
//         colorScheme: {
//             light: {
//                 surface: {
//                     0: '#ffffff',
//                     50: '{slate.50}',
//                     100: '{slate.100}',
//                     200: '{slate.200}',
//                     300: '{slate.300}',
//                     400: '{slate.400}',
//                     500: '{slate.500}',
//                     600: '{slate.600}',
//                     700: '{slate.700}',
//                     800: '{slate.800}',
//                     900: '{slate.900}',
//                     950: '{slate.950}'
//                 }
//             },
//             dark: {
//                 surface: {
//                     0: '#ffffff',
//                     50: '{zinc.50}',
//                     100: '{zinc.100}',
//                     200: '{zinc.200}',
//                     300: '{zinc.300}',
//                     400: '{zinc.400}',
//                     500: '{zinc.500}',
//                     600: '{zinc.600}',
//                     700: '{zinc.700}',
//                     800: '{zinc.800}',
//                     900: '{zinc.900}',
//                     950: '{zinc.950}'
//                 }
//             }
//         }
//     }
// });

// export default {
//     preset: MyPreset,
//     options: {
//         darkModeSelector: '.dark'
//     }
// };
const MyTheme= definePreset(Aura, {
  semantic: {
    primary: {
      50: '{orange.50}',
      100: '{orange.100}',
      200: '{orange.200}',
      300: '{orange.300}',
      400: '{orange.400}',
      500: '{orange.500}',
      600: '{orange.600}',
      700: '{orange.700}',
      800: '{orange.800}',
      900: '{orange.900}',
      950: '{orange.950}',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '{gray.50}',
          100: '{gray.100}',
          200: '{gray.200}',
          300: '{gray.300}',
          400: '{gray.400}',
          500: '{gray.500}',
          600: '{gray.600}',
          700: '{gray.700}',
          800: '{gray.800}',
          900: '{gray.900}',
          950: '{gray.950}',
        },
      },
    },
  },
});
//export default MyPreset;

export default {
    preset: MyTheme,
    options: {
        darkModeSelector: '.p-dark',
        cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
    }
};