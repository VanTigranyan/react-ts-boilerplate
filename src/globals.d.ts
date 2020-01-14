import '@testing-library/jest-dom/extend-expect';

declare interface NodeModule {
  hot: {
    accept(path: string, fn: () => void, callback?: () => void): void;
  };
}
