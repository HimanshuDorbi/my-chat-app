import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* react strictmode ki vjah se console mein info ya useeffect usestate ki value 2 baar print hori hai , 1 baar print ke liye strict mode hta do */}
    <ChakraProvider>
    <App />
    </ChakraProvider>
  </React.StrictMode>
);


