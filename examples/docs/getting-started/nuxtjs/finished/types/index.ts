import content from "../lib/content.json";

export type Content = typeof content;

export type Fields = Content[0]["fields"];
