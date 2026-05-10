import { ReturnFetchDefaultOptions } from "return-fetch";

import { returnFetchApi } from "./return-fetch-api";
import { returnFetchAuth } from "./return-fetch-auth";
import { returnFetchCookie } from "./return-fetch-cookie";
import { returnFetchHousehold } from "./return-fetch-household";
import { returnFetchJson } from "./return-fetch-json";
import { returnFetchRefresh } from "./return-fetch-refresh";

export const returnFetchExtended = (args?: ReturnFetchDefaultOptions) =>
  returnFetchJson({
    fetch: returnFetchApi({
      fetch: returnFetchRefresh({
        fetch: returnFetchAuth({
          fetch: returnFetchHousehold({
            fetch: returnFetchCookie(args),
          }),
        }),
      }),
    }),
  });
