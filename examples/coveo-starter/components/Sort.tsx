import { FC, useEffect, useMemo, useState } from "react";
import {
  ComponentProps,
  registerUniformComponent,
} from "@uniformdev/canvas-react";
import {
  buildSort,
  buildRelevanceSortCriterion,
  buildDateSortCriterion,
  SortOrder,
} from "@coveo/headless";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import headlessEngine from "../context/Engine";

//Coveo Sort docs https://docs.coveo.com/en/headless/latest/reference/search/controllers/sort/

const SortConfiguration: FC = () => {
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

type SortProps = ComponentProps<{
  sort?: {
    sortConfiguration?: boolean;
  };
}>;

const Sort: FC<SortProps> = ({ sort }) => {
  if (!sort?.sortConfiguration) {
    return null;
  }
  return <SortConfiguration />;
};

registerUniformComponent({
  type: "coveo-sort",
  component: Sort,
});

export default Sort;
