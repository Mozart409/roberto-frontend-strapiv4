import qs from "qs";
import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";
import { getStrapiURL } from "./api-helpers";

// biome-ignore lint/suspicious/noExplicitAny: Strapi API response shapes are dynamic
type Any = any;

/**
 * Strapi v5 returns a flat shape: entries/media expose their fields directly
 * (with `documentId`) instead of the v4 `{ data: { id, attributes } }` wrapper,
 * and related/media fields are no longer wrapped in `{ data }`.
 *
 * This frontend was written against the v4 shape, so we recursively rebuild it:
 *   - entries & media (objects/arrays carrying `documentId`) -> `{ data: { id, attributes } }`
 *   - components & dynamic-zone items (no `documentId`)      -> kept inline, recursed
 */
function isEntity(value: Any): boolean {
  return (
    value != null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "documentId" in value
  );
}

function normalizeFieldValue(value: Any): Any {
  if (Array.isArray(value)) {
    // A relation/media array carries entities; a repeatable component or
    // dynamic zone does not. Only the former gets the v4 `{ data: [...] }` wrapper.
    if (value.length > 0 && isEntity(value[0])) {
      return { data: value.map(normalizeEntity) };
    }
    return value.map(normalizeFieldValue);
  }

  if (value != null && typeof value === "object") {
    if (isEntity(value)) {
      return { data: normalizeEntity(value) };
    }
    // Component, dynamic-zone item, or plain object (e.g. media `formats`):
    // keep inline but recurse so nested media/relations are wrapped too.
    const out: Any = {};
    for (const [key, val] of Object.entries(value)) {
      out[key] = normalizeFieldValue(val);
    }
    return out;
  }

  return value;
}

function normalizeEntity(entity: Any): Any {
  const { documentId, id, ...fields } = entity;
  const attributes: Any = {};
  for (const [key, val] of Object.entries(fields)) {
    attributes[key] = normalizeFieldValue(val);
  }
  return { id: documentId ?? id, attributes };
}

function normalizeStrapiResponse(payload: Any): Any {
  if (payload == null || typeof payload !== "object") return payload;
  // Pass error payloads through untouched so callers can read `res.error.status`.
  if (payload.error) return payload;
  if (!("data" in payload)) return payload;

  const { data, ...rest } = payload;
  let normalizedData: Any;
  if (data === null) {
    normalizedData = null;
  } else if (Array.isArray(data)) {
    normalizedData = data.map(normalizeEntity);
  } else {
    normalizedData = normalizeEntity(data);
  }
  return { ...rest, data: normalizedData };
}

export async function fetchAPI(
  path: string,
  urlParamsObject = {},
  options = {},
) {
  try {
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${getStrapiURL(
      `/api${path}${queryString ? `?${queryString}` : ""}`,
    )}`;

    const data = await wretch(requestUrl)
      .addon(QueryStringAddon)
      .options({ ...options })
      .get()
      .json()
      // Surface HTTP errors as the Strapi error shape instead of swallowing
      // them, so `undefined` never reaches the page components.
      .catch((err: Any) => {
        if (err?.json) return err.json;
        return {
          data: null,
          error: {
            status: err?.status ?? 500,
            name: err?.name ?? "FetchError",
            message: err?.message ?? "Unknown error",
          },
        };
      });

    return normalizeStrapiResponse(data);
  } catch (error) {
    console.error(error);
    throw new Error(
      `Please check if your server is running and you set all the required tokens. ${error}`,
    );
  }
}
