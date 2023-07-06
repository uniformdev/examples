import { FC, useEffect, useMemo, useState } from "react";
import {
  buildSort,
  buildRelevanceSortCriterion,
  buildDateSortCriterion,
  SortOrder,
} from "@coveo/headless";
import headlessEngine from "../context/Engine";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

const Sort: FC = () => {
  const headlessSort = useMemo(() => buildSort(headlessEngine), []);

  const [state, setState] = useState(headlessSort.state);

  useEffect(() => {
    const updateState = () => {
      setState(headlessSort.state);
    };
    headlessSort.subscribe(updateState);
  }, []);

  const dateDescendingSortCriterion = buildDateSortCriterion(
    SortOrder.Descending
  );
  const dateAscendingSortCriterion = buildDateSortCriterion(
    SortOrder.Ascending
  );

  const relevanceSortCriterion = buildRelevanceSortCriterion();

  const handleChange = (
    event: SelectChangeEvent<"relevancy" | "date descending" | "date ascending">
  ) => {
    switch (event.target.value) {
      case "relevancy":
        headlessSort.sortBy(relevanceSortCriterion);
        break;
      case "date descending":
        headlessSort.sortBy(dateDescendingSortCriterion);
        break;
      case "date ascending":
        headlessSort.sortBy(dateAscendingSortCriterion);
        break;
      default:
        break;
    }
  };

  return (
    <Grid item xs={4}>
      <FormControl fullWidth>
        <InputLabel id="sortby">Sort by</InputLabel>
        <Select
          labelId="sortby"
          id="sortby"
          value={
            state.sortCriteria as
              | ""
              | "relevancy"
              | "date descending"
              | "date ascending"
              | undefined
          }
          label="Sort"
          onChange={handleChange}
        >
          <MenuItem value="relevancy">Relevance</MenuItem>
          <MenuItem value="date descending">Date Descending</MenuItem>
          <MenuItem value="date ascending">Date Ascending</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );
};

export default Sort;
