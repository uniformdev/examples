import React, { useEffect } from "react";
import { useUniformContext } from "@uniformdev/context-react";
import { parse } from "cookie";

export const CookieSetter: React.FC = () => {
  const { context } = useUniformContext();
  useEffect(() => {
    document.cookie = "unfrmconf_registered=true; path=/; samesite=lax";
    context.update({
      cookies: parse(document.cookie),
    });
  }, []);

  return null;
};
