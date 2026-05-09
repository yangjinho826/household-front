import { ReturnFetchDefaultOptions } from "return-fetch";

import { returnFetchApi } from "./return-fetch-api";
import { returnFetchAuth } from "./return-fetch-auth";
import { returnFetchCookie } from "./return-fetch-cookie";
import { returnFetchJson } from "./return-fetch-json";
import { returnFetchRefresh } from "./return-fetch-refresh";

export const returnFetchExtended = (args?: ReturnFetchDefaultOptions) =>
  returnFetchJson({
    fetch: returnFetchApi({
      fetch: returnFetchRefresh({
        fetch: returnFetchAuth({
          fetch: returnFetchCookie(args),
        }),
      }),
    }),
  });
