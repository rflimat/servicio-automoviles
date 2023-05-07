import { all, fork } from "redux-saga/effects";

//public
import LayoutSaga from "./layout/saga";
import dashboardSaga from "./dashboard/saga";

export default function* rootSaga() {
  yield all([
    //public
    fork(LayoutSaga),
    fork(dashboardSaga),
  ]);
}
