import { call, put, select } from "redux-saga/effects";

//import { logout } from "../effects/user";
import { application } from "../actions";

const APPLICATION_TYPE = "application/json";

export const METHODS = {
  DELETE: "DELETE",
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
};

// eslint-disable-next-line
function* handleDelete() {
  return {
    error: false,
    success: true,
    result: "",
  };
}

function* handleUnauthorized() {
  yield put(application.stop);
  return {
    error: true,
    result: "unauthorized request",
  };
}

const statusCodeMatchRange = (ranges, statusCode) => {
  // eslint-disable-next-line
  return ranges.find((r) => {
    const buff = r.split("-");
    if (buff.length === 1) {
      if (statusCode.toString() === r) {
        return true;
      }
    } else {
      if (buff[0] <= statusCode && statusCode <= buff[1]) {
        return true;
      }
    }
  });
};

const createHandle = (responseType) => {
  return function* (response) {
    if (response.json) {
      const jsonResponse = yield call([response, response.json]);

      return {
        [responseType]: true,
        result: jsonResponse,
        status: response.status,
      };
    }

    if (response.body) {
      const streamResponse = yield call([response, response.body]);
      return {
        [responseType]: true,
        result: streamResponse,
        status: response.status,
      };
    }

    const textResponse = yield call([response, response.text]);
    return {
      [responseType]: true,
      result: textResponse,
      status: response.status,
    };
  };
};

export const handleSuccess = createHandle("success");
export const handleError = createHandle("error");

export function* callAPI({
  authorization = true,
  url = "",
  method = METHODS.GET,
  body = {},
  language = "",
  additionalHeaders = {},
  onResponse = {
    0: handleError,
    "200-203": handleSuccess,
    204: handleDelete,
    "205-299": handleSuccess,
    "300-399": handleSuccess,
    401: handleUnauthorized,
    400: handleError,
    "402-499": handleError,
    "500-599": handleError,
  },
}) {
  const headers = new Headers();
  headers.append("Accept", "application/json");
  headers.append("Origin", "*");
  headers.append("Cache-Control", "no-cache");
  // TODO: remove this one ?
  // headers.append("x-requested-with", "XMLHttpRequest");

  if (method === METHODS.POST || method === METHODS.PUT) {
    headers.append("Content-Type", APPLICATION_TYPE);
  }

  if (authorization) {
    const token = yield select((state) => state.application.token);
    headers.append("Authorization", `Bearer ${token}`);
  }

  if (language) {
    headers.append("Accept-Language", language);
  }

  if (additionalHeaders) {
    Object.entries(additionalHeaders).forEach(([key, value]) => {
      headers.append(key, value);
    });
  }
  const params = {
    method,
    headers,
    mode: "cors",
    body: JSON.stringify(body),
    timeout: 500,
  };

  if (method === METHODS.GET || method === METHODS.DELETE) delete params.body;
  let response;
  try {
    response = yield call(fetch, url, params);
  } catch (exception) {
    return {
      result: "offline",
      status: 0,
      success: false,
      error: true,
      responseText: "offline",
      exception,
    };
  }

  const match = yield call(
    statusCodeMatchRange,
    Object.keys(onResponse),
    response.status
  );

  if (onResponse[match]) {
    return yield call(onResponse[match], response);
  }
  console.error("unexcepted response status code");
}
