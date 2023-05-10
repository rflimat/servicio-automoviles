import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  yearData,
  monthData,
  weekData,
} from "../../common/data";

const fakeBackend = () => {
  // This sets the mock adapter on the default instance
  const mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

  mock.onGet("/weekly-data").reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (weekData) {
          // Passing fake JSON data as response
          resolve([200, weekData]);
        } else {
          reject([400, "Cannot get wallet data"]);
        }
      });
    });
  });

  mock.onGet("/yearly-data").reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (yearData) {
          // Passing fake JSON data as response
          resolve([200, yearData]);
        } else {
          reject([400, "Cannot get wallet data"]);
        }
      });
    });
  });

  mock.onGet("/monthly-data").reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (monthData) {
          // Passing fake JSON data as response
          resolve([200, monthData]);
        } else {
          reject([400, "Cannot get wallet data"]);
        }
      });
    });
  });
};

export default fakeBackend;
