import { useCallback, useEffect, useState } from "react";
import dropdownStyles from "../../css/dropdown.module.css";
import { debounce, join } from "../../utility";
import React from "react";

export default function SearchBar({
  onSearch,
  handleKeyDown,
}: {
  onSearch: (search: string) => void;
  handleKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  const [searchText, setSearchText] = useState("");
  const debounced = useCallback(debounce(onSearch, 300), []);

  useEffect(() => {
    debounced(searchText);
  }, [searchText, debounced]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typed = e.target.value;
    setSearchText(typed);
  };

  return (
    <input
      className={join(dropdownStyles.formInput, dropdownStyles.textBasic)}
      name="search"
      type="text"
      placeholder="Search..."
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
      value={searchText}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}
