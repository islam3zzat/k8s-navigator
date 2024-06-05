import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ClearIcon from "@mui/icons-material/Clear";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";
import { useAppContext } from "../../app-context";

export const FindInPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const { state, dispatch } = useAppContext();

  const handleSearch = () => {
    window.electron.findInPage(searchText);
  };

  const handleStopSearch = useCallback(() => {
    window.electron.stopFindInPage();
    setSearchText("");

    dispatch({ type: "HIDE_FIND_IN_PAGE" });
  }, [dispatch]);

  const handleFindNext = useCallback(() => {
    if (!searchText) return;

    window.electron.findNext(searchText);
  }, [searchText]);

  const handleFindPrevious = () => {
    window.electron.findPrevious(searchText);
  };
  const visibilityClass = state.isFindInPageOpen ? "visible" : "hidden";
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        searchRef.current.select();
      }

      //   handle escape key
      if (e.key === "Escape") {
        handleStopSearch();
      }

      // handle enter key
      if (e.key === "Enter") {
        handleFindNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleFindNext, handleStopSearch]);

  return (
    <Stack
      className={`find-in-page ${visibilityClass}`}
      direction="row"
      spacing={1}
      justifyContent="center"
      aria-hidden={!state.isFindInPageOpen}
      alignItems="center"
    >
      <label
        htmlFor="searchInput"
        style={{ position: "absolute", left: "-9999px" }}
      >
        Find in page
      </label>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (searchText) handleFindNext();
        }}
        role="search"
      >
        <input
          id="searchInput"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Find in page"
          ref={searchRef}
          style={{ fontSize: "1rem" }}
        />
      </form>

      <IconButton
        color="primary"
        aria-label="Initiate search"
        size="small"
        disabled={!searchText}
        onClick={handleSearch}
      >
        <FindInPageIcon />
      </IconButton>
      <IconButton
        color="primary"
        aria-label="Find previous match"
        size="small"
        disabled={!searchText}
        onClick={handleFindPrevious}
      >
        <ArrowUpwardIcon />
      </IconButton>
      <IconButton
        color="primary"
        aria-label="Find next match"
        size="small"
        disabled={!searchText}
        onClick={handleFindNext}
      >
        <ArrowDownwardIcon />
      </IconButton>
      <IconButton
        aria-label="Clear search text"
        size="small"
        onClick={handleStopSearch}
      >
        <ClearIcon />
      </IconButton>
    </Stack>
  );
};

export default FindInPage;
