import React, { useState, useEffect } from "react";
import { VerticalRhythm, Input } from "@uniformdev/design-system";
import { debounce } from "lodash";
import { Entry } from "../types/entry";

interface EntrySelectorProps {
  entryList: Entry[]; // List of Entries to display
  contentType: string; // Content type of the Entries
  selectedIds: string[]; // IDs of the selected Entries
  onSelect: (entry: Entry) => void; // Callback for when a Entry is selected
}

// EntrySelector component is used to select an Entry from a list of Entries associated with a content type.
// It displays a search input field to filter the list of Entries by name.
// The user can select an Entry from the filtered list.
// The selected Entry is highlighted in the list.
// The selected Entry is displayed in the search input field.
// The selected Entry is passed to the onSelect callback function.
// The component is used in the SingleEntryDataEditorPage component.

export const EntrySelector: React.FC<EntrySelectorProps> = ({
  entryList = [],
  selectedIds,
  onSelect,
}) => {
  const [filteredEntryList, setFilteredEntryList] = useState<Entry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setFilteredEntryList(entryList);
  }, [entryList]);

  const handleSearch = debounce((query: string) => {
    setSearchQuery(query);

    // Filter the list of Entries based on the search query
    // The search is case-insensitive and looks for the query string in the Entry name
    // The filtered list is sorted alphabetically
    // Entries with names starting with the query string are prioritized
    // The filtered list is updated with the search results
    // If the search query is empty, the full list of Entries is displayed
    if (query.trim() !== "") {
      const results = entryList
        .filter((entry) =>
          entry.title.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => {
          // Prioritize names starting with the query
          const startsWithA = a.title
            .toLowerCase()
            .startsWith(query.toLowerCase());
          const startsWithB = b.title
            .toLowerCase()
            .startsWith(query.toLowerCase());
          if (startsWithA && !startsWithB) return -1; // a comes first
          if (!startsWithA && startsWithB) return 1; // b comes first
          return a.title.localeCompare(b.title); // Otherwise, sort alphabetically
        });

      setFilteredEntryList(results);
    } else {
      setFilteredEntryList(entryList);
    }
  }, 10);

  const handleSelection = (entry: Entry) => {
    onSelect(entry);
    setSearchQuery(entry.title);
  };

  return (
    <VerticalRhythm>
      <Input
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Filter by name..."
        label="Search Entry"
      />
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "8px",
          marginTop: "16px",
        }}
      >
        {filteredEntryList.length > 0 ? (
          filteredEntryList.map((entry) => (
            <div
              key={entry.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderRadius: "4px",
                cursor: "pointer",
                marginBottom: "8px",
                backgroundColor: selectedIds.includes(entry.id.toString())
                  ? "#F0F8FF"
                  : "#FFFFFF",
                border: selectedIds.includes(entry.id.toString())
                  ? "1px solid #007BFF"
                  : "1px solid transparent",
                transition: "background-color 0.2s ease, border 0.2s ease",
              }}
              onClick={() => handleSelection(entry)}
            >
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: "bold" }}>
                  {highlightQuery(entry.title, searchQuery)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", color: "#666" }}>
            No Entry found
          </div>
        )}
      </div>
    </VerticalRhythm>
  );
};

// Helper function to highlight the query in the name
const highlightQuery = (name: string, query: string): React.ReactNode => {
  if (!query) return name;
  const parts = name.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} style={{ color: "#007BFF", fontWeight: "bold" }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

export default EntrySelector;
