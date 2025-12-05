import qs from "qs";
import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";
import { getStrapiURL } from "./api-helpers";

export async function fetchAPI(
  path: string,
  urlParamsObject = {},
  options = {},
) {
  try {
    // Build request URL
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${
      getStrapiURL(
        `/api${path}${queryString ? `?${queryString}` : ""}`,
      )
    }`;
    // console.debug("requestUrl", requestUrl);
    // Trigger API call using wretch
    const data = await wretch(requestUrl)
      .addon(QueryStringAddon)
      .options({ ...options })
      .get()
      .badRequest((err) => console.log(err.status))
      .unauthorized((err) => console.log(err.status))
      .forbidden((err) => console.log(err.status))
      .notFound((err) => console.log(err.status))
      .timeout((err) => console.log(err.status))
      .internalError((err) => console.log(err.status))
      .error(418, (err) => console.log(err.status))
      .fetchError((err) => console.log(err))
      .json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Please check if your server is running and you set all the required tokens. ${error}`,
    );
  }
}
