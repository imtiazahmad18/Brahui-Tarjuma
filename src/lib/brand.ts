import en from "../../locales/en.json";
import brh from "../../locales/brh.json";

export const SITE_NAME = en["site.name"];
export const SITE_NAME_BRH = brh["site.name"];
export function getSiteName(locale: "en" | "brh" = "en") {
  return locale === "brh" ? SITE_NAME_BRH : SITE_NAME;
}
