import '@testing-library/jest-dom';
import 'whatwg-fetch';

// react-router-dom (y dependencias) usan TextEncoder/TextDecoder.
// En algunos entornos de Jest/jsdom no existen por defecto.
import { TextDecoder, TextEncoder } from 'util';

// @ts-expect-error assign to global
global.TextEncoder = TextEncoder;
// @ts-expect-error assign to global
global.TextDecoder = TextDecoder;
