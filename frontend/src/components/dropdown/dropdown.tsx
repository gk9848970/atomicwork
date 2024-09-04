import { useEffect, useState } from "react";
import DropdownMenu from "./dropdown-menu";
import CloseIcon from "./close-icon";
import OpenIcon from "./open-icon";
import dropdownStyles from "../../css/dropdown.module.css";
import { join } from "../../utility";

type DropdownProps = {
  url: string;
  searchMode: "internal" | "external";
  defaultOptions?: string[];
};

export default function Dropdown({
  searchMode = "internal",
  url,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("None");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        if (!event.target.closest("#dropdown")) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const onSelect = (option: string) => {
    setValue(option);
    setIsOpen(false);
  };

  return (
    <div id="dropdown">
      <div
        tabIndex={0}
        className={join(
          dropdownStyles.dropdownBox,
          isOpen ? dropdownStyles.borderActive : dropdownStyles.borderInactive
        )}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIsOpen(!isOpen);
          }
          if (e.key === "Escape") {
            setIsOpen(false);
          }
        }}
      >
        <span className={dropdownStyles.textBasic}>{value}</span>
        <span style={{ color: "#A3A2A6" }}>
          {isOpen ? <CloseIcon /> : <OpenIcon />}
        </span>
      </div>

      {isOpen && (
        <div
          style={{
            marginTop: "5px",
          }}
        >
          <DropdownMenu
            setIsOpen={setIsOpen}
            searchMode={searchMode}
            url={url}
            onSelect={onSelect}
            selectedOption={value}
          />
        </div>
      )}
    </div>
  );
}
