import React from "react";
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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

export default class Sort extends React.Component {
  private headlessSort: SortType;
  state: SortState;
  relevanceSortCriterion: SortByRelevancy = buildRelevanceSortCriterion();
  dateDescendingSortCriterion: SortByDate = buildDateSortCriterion(
    SortOrder.Descending
  );
  dateAscendingSortCriterion: SortByDate = buildDateSortCriterion(
    SortOrder.Ascending
  );

  constructor(props: any) {
    super(props);

    this.headlessSort = buildSort(headlessEngine, {
      initialState: {
        criterion: this.relevanceSortCriterion,
      },
    });

    this.state = this.headlessSort.state;
  }

  componentDidMount() {
    this.headlessSort.subscribe(() => this.updateState());
  }

  updateState() {
    this.setState(this.headlessSort.state);
  }

  handleChange(event: SelectChangeEvent<string>) {
    switch (event.target.value) {
      case "relevance":
        this.headlessSort.sortBy(this.relevanceSortCriterion);
        break;
      case "datedescending":
        this.headlessSort.sortBy(this.dateDescendingSortCriterion);
        break;
      default:
        this.headlessSort.sortBy(this.dateAscendingSortCriterion);
        break;
    }
  }

  getSelectValue() {
    if (this.headlessSort.isSortedBy(this.relevanceSortCriterion)) {
      return "relevance";
    }
    if (this.headlessSort.isSortedBy(this.dateDescendingSortCriterion)) {
      return "datedescending";
    }
    if (this.headlessSort.isSortedBy(this.dateAscendingSortCriterion)) {
      return "dateascending";
    }
  }

  render() {
    return (
      <FormControl fullWidth>
        <InputLabel id="sortby">Sort by</InputLabel>
        <Select
          labelId="sortby"
          id="sortby"
          value={this.getSelectValue()}
          label="Sort"
          onChange={(e) => this.handleChange(e)}
        >
          <MenuItem value="relevance">Relevance</MenuItem>
          <MenuItem value="datedescending">Date Descending</MenuItem>
          <MenuItem value="dateascending">Date Ascending</MenuItem>
        </Select>
      </FormControl>
    );
  }
}
