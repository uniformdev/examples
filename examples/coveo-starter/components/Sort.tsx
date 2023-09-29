import { FC, useContext, useEffect, useMemo, useState } from "react";
import { registerUniformComponent } from "@uniformdev/canvas-react";
import {
  buildSort,
  buildRelevanceSortCriterion,
  buildDateSortCriterion,
  SortOrder,
} from "@coveo/headless";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { HeadlessEngineContext } from "../context/Engine";

//Coveo Sort docs https://docs.coveo.com/en/headless/latest/reference/search/controllers/sort/

const Sort: FC = () => {
  const headlessEngine = useContext(HeadlessEngineContext);

  const headlessSort = useMemo(
    () => buildSort(headlessEngine),
    [headlessEngine]
  );

  const [state, setState] = useState(headlessSort.state);

  useEffect(
    () =>
      headlessSort.subscribe(() => {
        setState(headlessSort.state);
      }),
    [headlessSort]
  );

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
  );
};

registerUniformComponent({
  type: "coveo-sort",
  component: Sort,
});

export default Sort;
