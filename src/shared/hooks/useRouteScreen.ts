import { useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useRouteBack from "./useRouteBack";

export default function useRouteScreen(key: string) {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const value = params.get(key);
  const parentParams = new URLSearchParams(params);
  parentParams.delete(key);
  const query = parentParams.toString();
  const parent = `${location.pathname}${query ? `?${query}` : ""}${location.hash}`;
  const close = useRouteBack(parent);

  const open = useCallback(
    (nextValue: string) => {
      const next = new URLSearchParams(location.search);
      next.set(key, nextValue);
      navigate(
        { pathname: location.pathname, search: next.toString(), hash: location.hash },
        { state: location.state },
      );
    },
    [key, location, navigate],
  );

  return { value, open, close };
}
