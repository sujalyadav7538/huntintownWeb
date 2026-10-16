import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function useRouteBack(fallback: string) {
  const navigate = useNavigate();

  return useCallback(() => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(fallback, { replace: true });
  }, [fallback, navigate]);
}
