// Tipos globales para tests (TS server / VS Code)
// Esto hace que `jest`, `describe`, `it`, `expect` y los matchers de jest-dom
// estén disponibles en los archivos *.test.ts(x) sin tocar el build de Vite.

import 'jest';
import '@testing-library/jest-dom';
