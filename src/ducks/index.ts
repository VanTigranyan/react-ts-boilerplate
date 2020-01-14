import { combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';

export interface RootState {
  someState: string;
}

export const rootReducer = combineReducers({});

const combinedSagas = {};

export function* rootSaga(): Generator {
  yield all(Object.values(combinedSagas).map(fork));
}
