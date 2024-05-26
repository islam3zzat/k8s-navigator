import { styled, Theme } from "@mui/material/styles";
import TableSortLabel, {
  tableSortLabelClasses,
} from "@mui/material/TableSortLabel";
import React, { forwardRef, useRef, useState } from "react";
import Table from "@mui/material/Table";
import Box from "@mui/material/Box";
import TableBody from "@mui/material/TableBody";
import TableCell, { TableCellProps } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { motion } from "framer-motion";
import { TableRow, TableRowProps, Typography, useTheme } from "@mui/material";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { visuallyHidden } from "@mui/utils";
import InputAdornment from "@mui/material/InputAdornment";
import Search from "@mui/icons-material/Search";
import moment from "moment";
import { BarLoader } from "react-spinners";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { WatchCheckbox } from "../watch-checkbox";
import { RefetchDataButton } from "../refetch-data-button";

const StyledTable = styled(Table)(({ theme }) => ({
  // Table background (slightly lighter than paper)
  backgroundColor: theme.palette.background.default,

  // Cell padding for better readability
  "& .MuiTableCell-root": {
    padding: theme.spacing(1.5), // Adjust spacing as needed
    borderBottom: `1px solid ${theme.palette.divider}`, // Use divider color for subtle borders
  },
}));

const TableRowWithRef = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ ...props }, ref) => {
    return <TableRow {...props} ref={ref} />;
  },
);
TableRowWithRef.displayName = "TableRowWithRef";

const MotionTableRow = motion(TableRowWithRef);
MotionTableRow.displayName = "MotionTableRow";

const StyledTableSortLabel = styled(TableSortLabel)(
  ({ theme }: { theme: Theme }) => ({
    [`&.${tableSortLabelClasses.active}`]: {
      // Target active sorting column
      color: theme.palette.primary.main, // Accent color on focus
    },
    [`&.${tableSortLabelClasses.active} .${tableSortLabelClasses.icon}`]: {
      color: theme.palette.primary.main, // Accent color on the icon
    },
    "&:focus-visible": {
      // Show focus indicator
      outline: "2px solid",
      outlineColor: theme.palette.secondary.main, // Accent color for focus outline
      outlineOffset: 2,
    },
    "&:hover": {
      color: theme.palette.text.primary, // Default color on hover
      [`& .${tableSortLabelClasses.icon}`]: {
        color: theme.palette.text.primary, // Default color on the icon
      },
    },
  }),
);

export type Column<T> = {
  name: string;
  label?: string;
  options?: {
    filter?: boolean;
    sort?: boolean;
  };
  align?: TableCellProps["align"];
  getData?: (row: T) => string | number | JSX.Element;
  getSearchableString?: (row: T) => string;
  compare?: (a: T, b: T) => number;
  width?: string | number;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  title: string;
  description: string;
  getId: (row: T) => string;
  hideSearch?: boolean;
  noResourcesMessage?: string;
  onRowClick?: (row: T) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  isLoading?: boolean;
  isFetching?: boolean;
  dataUpdatedAt?: number;
  onRefresh?: () => void;
  isWatching?: boolean;
  handleWatchToggle?: () => void;
};

export const DataTable = <T,>({
  columns,
  data,
  noResourcesMessage,
  getId,
  title,
  description,
  hideSearch,
  onRowClick,
  error,
  isLoading,
  isFetching,
  dataUpdatedAt,
  onRefresh,
  isWatching,
  handleWatchToggle,
}: Props<T>) => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("Name");
  const tableRef = useRef<HTMLTableElement>(null);

  const [filter, setFilter] = React.useState<string>("");
  const filteredData = React.useMemo(() => {
    const items = data || [];
    if (!filter) return items;

    return items.filter((d) => {
      const values = columns
        .map((c) => c?.getSearchableString?.(d) || c.getData(d))
        .filter((v) => typeof v === "string" || typeof v === "number");
      return values.some((value) => {
        return value.toString().toLowerCase().includes(filter.toLowerCase());
      });
    });
  }, [data, filter, columns]);

  const resources = React.useMemo(() => {
    const column = columns.find((c) => c.name === orderBy);
    if (!column) {
      return filteredData;
    }

    const isAsc = orderBy === column.name && order === "asc";

    return [...filteredData].sort((a, b) => {
      return column.compare(a, b) * (isAsc ? 1 : -1);
    });
  }, [columns, filteredData, order, orderBy]);

  const theme = useTheme();
  const color = theme.palette.primary.main;

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error instanceof Error ? error.message : "Failed to fetch data."}
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Stack justifyContent="center" alignItems="center">
        <BarLoader color={color} />
      </Stack>
    );
  }
  if (!data || data.length === 0) {
    return (
      <Typography>{noResourcesMessage || "No resources found"}</Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="flex-start" alignItems="flex-end">
        {!hideSearch && (
          <>
            <label
              htmlFor="searchInput"
              style={{ position: "absolute", left: "-9999px" }}
            >
              Search
            </label>
            {/* Hidden Label */}
            <TextField
              id="searchInput" // Add id to input
              value={filter || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilter(e.target.value)
              }
              placeholder="Search..."
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />
          </>
        )}
      </Stack>
      {dataUpdatedAt && (
        <Stack direction="row" alignItems="center" spacing={2}>
          {onRefresh && (
            <RefetchDataButton
              isLoading={isLoading || isFetching}
              refetch={onRefresh}
            />
          )}
          <Typography>
            Last fetched {moment(dataUpdatedAt).format("h:mm:ss a")}
          </Typography>
          {handleWatchToggle && (
            <WatchCheckbox
              isWatching={isWatching}
              onWatchToggle={handleWatchToggle}
            />
          )}
          {isFetching && <BarLoader color={color} />}
        </Stack>
      )}
      <TableContainer
        elevation={3}
        component={Paper}
        sx={{ maxBlockSize: "50vh" }}
      >
        <StyledTable
          stickyHeader
          sx={{ minWidth: 650 }}
          aria-label={title}
          aria-describedby="table-summary"
          ref={tableRef}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.name}
                  align={column.align}
                  sortDirection={orderBy === column.name ? order : false}
                  sx={{ width: column.width }}
                >
                  <StyledTableSortLabel // Use the styled component
                    active={orderBy === column.name}
                    direction={orderBy === column.name ? order : "asc"}
                    onClick={() => {
                      const isAsc = orderBy === column.name && order === "asc";
                      setOrder(isAsc ? "desc" : "asc");
                      setOrderBy(column.name);
                    }}
                  >
                    {column.label || column.name}
                    {orderBy === column.name ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </StyledTableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map((row, index) => (
              <MotionTableRow
                hover
                key={getId(row)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, delay: index * 0.05 }}
                sx={{
                  cursor: onRowClick ? "pointer" : "default",
                }}
                tabIndex={0}
                onClick={() => onRowClick?.(row)}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" && onRowClick) {
                    onRowClick(row);
                  }
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    align={column.align}
                    sx={{
                      width: column.width,
                      lineBreak: "anywhere",
                    }}
                    key={column.name}
                  >
                    {column.getData(row)}
                  </TableCell>
                ))}
              </MotionTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
      <div id="table-summary" style={{ position: "absolute", left: "-9999px" }}>
        {description}
      </div>
    </Stack>
  );
};
