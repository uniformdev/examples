import React from "react";
import { renderToHtml, RichTextNode } from "@uniformdev/richtext";
import { RichTextDescription } from "@/types/search";

type SearchResultCardProps = {
  title: string;
  description: RichTextDescription;
};

export type Slots = string;

export const SearchResultCard = ({
  title,
  description,
}: SearchResultCardProps) => {
  let htmlDescription = "";
  if (
    description?.type === "richText" &&
    description.value &&
    description.value.root
  ) {
    htmlDescription = renderToHtml(description.value.root as RichTextNode);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Image placeholder */}
      <div className="aspect-[3/2] bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Image placeholder</span>
      </div>
      <div className="p-4">
        <h1 className="font-semibold text-lg mb-2">{title}</h1>
        {/* If actual text is available, render it; else show dummy text */}
        {htmlDescription ? (
          <div
            className="text-sm text-gray-600"
            dangerouslySetInnerHTML={{ __html: htmlDescription }}
          />
        ) : (
          <p className="text-sm text-gray-600">Some description goes here...</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultCard;
