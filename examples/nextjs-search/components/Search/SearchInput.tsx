import React from "react";

interface SearchInputProps {
  onSearch: (term: string) => void;
}

function SearchInput({ onSearch }: SearchInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <input
      className="
        search-input
        w-full
        p-2
        border
        rounded-md
        focus:outline-none
        focus:ring-2
        focus:ring-blue-400
        transition-shadow
      "
      type="text"
      placeholder="Search articles..."
      onChange={handleChange}
    />
  );
}

export default SearchInput;