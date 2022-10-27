import React, { useEffect, useState } from "react";
import {
  EntrySearch,
  useMeshLocation,
} from "@uniformdev/mesh-sdk-react";
import { LoadingIndicator } from "@uniformdev/design-system";
import { createClient } from "monsterpedia";

function toResult(monster) {
  const { index, name } = monster;
  return { id: index, title: name };
}

function getSearchResults(filter, monsters) {
  if (!monsters) {
    return [];
  }
  if (!filter) {
    return monsters.map(toResult);
  }
  const regex = new RegExp(filter, "i");
  const filtered = monsters.filter((monster) => {
    return monster.name.match(regex);
  });
  return filtered.map(toResult);
}

export default function MonsterListParameterEditor() {
  const { value, setValue, metadata } = useMeshLocation();
  const client = createClient(metadata?.settings?.baseUrl);
  const [loading, setLoading] = useState(true);
  const [monsters, setMonsters] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchText, setSearchText] = useState();

  async function addMetadata(selected) {
    for (let i = 0; i < selected.length; i++) {
      const monster = await client.getMonster(selected[i].id);
      if (monster) {
        const { alignment, index, size, url } = monster;
        selected[i].metadata = { alignment, index, size, url };
      }
    }
    setSelectedItems(selected);
  }

  useEffect(() => {
    async function getMonsters() {
      const filter = metadata?.parameterDefinition?.typeConfig?.filter;
      const monsters = await client.getMonsters(filter);
      setMonsters(monsters);
      const results = getSearchResults(searchText, monsters);
      setResults(results);
      if (value?.index) {
        const selected = results.filter((result) => result.id == value.index);
        await addMetadata(selected);
        setSelectedItems(selected);
      }
      setLoading(false);
    }
    getMonsters();
  }, []);

  useEffect(() => {
    if (value?.index) {
      const selected = results.filter((result) => result.id == value.index);
      if (selected && selected.length > 0) {
        addMetadata(selected).then(() => {
          setSelectedItems(selected);
        });
        return;
      }
    }
    setSelectedItems();
  }, [value]);

  useEffect(() => {
    const results = getSearchResults(searchText, monsters);
    setResults(results);
  }, [searchText]);

  const onSearch = (text) => setSearchText(text);

  const onSelect = (selected) => {
    if (selected && selected.length == 1) {
      setValue({ index: selected[0].id });
    } else {
      setValue("");
    }
  };

  return (
    <div>
      {loading && <LoadingIndicator />}
      {!loading && (
        <EntrySearch
          logoIcon="/monster-badge.svg"
          multiSelect={false}
          results={results}
          search={onSearch}
          select={onSelect}
          selectedItems={selectedItems}
        />
      )}
    </div>
  );
}
