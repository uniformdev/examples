import React, {ChangeEvent, FC, useEffect, useMemo, useState} from "react";
import {
  Sort as SortType,
  SortState,
  buildSort,
  buildRelevanceSortCriterion,
  buildDateSortCriterion,
  SortOrder,
  SortByRelevancy,
  SortByDate,
} from "@coveo/headless";
import headlessEngine from "../context/Engine";
import {
  FormControl, Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

const Sort: FC = () => {
  const relevanceSortCriterion = buildRelevanceSortCriterion();
  const headlessSort = useMemo(()=>      buildSort(headlessEngine, {
    initialState: {
      criterion: relevanceSortCriterion,
    },
  }),[]);

  const dateDescendingSortCriterion = buildDateSortCriterion(SortOrder.Descending);
  const dateAscendingSortCriterion = buildDateSortCriterion(SortOrder.Ascending);

  const handleChange = (event: SelectChangeEvent<"relevance" | "datedescending" | "dateascending">) => {
    switch (event.target.value) {
      case 'relevance':
        headlessSort.sortBy(relevanceSortCriterion);
        break;
      case 'datedescending':
        headlessSort.sortBy(dateDescendingSortCriterion);
        break;
      case 'dateascending':
        headlessSort.sortBy(dateAscendingSortCriterion);
        break;
      default:
        break;
    }
  };

  const getSelectValue = () => {
    if (headlessSort.isSortedBy(relevanceSortCriterion)) {
      return 'relevance';
    }
    if (headlessSort.isSortedBy(dateDescendingSortCriterion)) {
      return 'datedescending';
    }
    if (headlessSort.isSortedBy(dateAscendingSortCriterion)) {
      return 'dateascending';
    }
  };

  return (
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel id="sortby">Sort by</InputLabel>
          <Select
              labelId="sortby"
              id="sortby"
              value={getSelectValue()}
              label="Sort"
              onChange={handleChange}
          >
            <MenuItem value="relevance">Relevance</MenuItem>
            <MenuItem value="datedescending">Date Descending</MenuItem>
            <MenuItem value="dateascending">Date Ascending</MenuItem>
          </Select>
        </FormControl>
      </Grid>
  );
};

export default Sort;
