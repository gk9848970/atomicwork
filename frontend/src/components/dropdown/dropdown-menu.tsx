import SearchBar from "./searchbar";
import dropdownStyles from "../../css/dropdown.module.css";
import { fetchUrl, join } from "../../utility";
import React, { useEffect, useMemo, useState } from "react";
import useAsync from "../../hooks/use-async";

type DropdownMenuProps = {
  onSelect: (option: string) => void;
  selectedOption: string;
  searchMode: "internal" | "external";
  url: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DropdownMenu({
  onSelect,
  selectedOption,
  searchMode,
  url,
  setIsOpen,
}: DropdownMenuProps) {
  const [query, setQuery] = useState<string>("");
  const { data, run, isLoading } = useAsync<string[]>();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Filter the options based on the query and searchMode
  const filteredOptions = useMemo(() => {
    if (!data) return [];

    if (query === "" || searchMode === "external") return data;

    return data?.filter((option: string) =>
      option.toLowerCase().includes(query.toLowerCase())
    );
  }, [data, query, searchMode]);

  // Making the API call to fetch the options
  useEffect(() => {
    if (!url) return;

    // Initial load when there are no options
    if (data === undefined && searchMode !== "external") {
      run(fetchUrl(url));
    }

    // A query is sent to the server to fetch the options, Also serves for initial load of external
    if (searchMode === "external") {
      run(fetchUrl(url, query));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, searchMode, url]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const prevIndex = focusedIndex ?? -1;
    switch (event.key) {
      case "ArrowDown":
        setFocusedIndex(
          prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case "ArrowUp":
        setFocusedIndex(
          prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        if (focusedIndex === null) return;
        onSelect(filteredOptions[focusedIndex]);
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const options = filteredOptions?.map((option: string, index: number) => (
    <li
      tabIndex={0}
      key={option}
      className={join(
        dropdownStyles.textBasic,
        dropdownStyles.dropdownOption,
        option === selectedOption || index === focusedIndex
          ? dropdownStyles.optionSelected
          : ""
      )}
      onClick={() => onSelect(option)}
      onFocus={() => setFocusedIndex(index)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onSelect(option);
        }
      }}
    >
      {option}
    </li>
  ));

  return (
    <div className={dropdownStyles.dropdownMenu}>
      <SearchBar
        onSearch={(search: string) => {
          setQuery(search);
        }}
        handleKeyDown={handleKeyDown}
      />
      {isLoading ? (
        <div className={dropdownStyles.loading}>Loading...</div>
      ) : (
        <ul>{options}</ul>
      )}
    </div>
  );
}
