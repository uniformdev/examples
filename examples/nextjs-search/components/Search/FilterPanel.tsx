import React from "react";

interface Bucket {
    value: string;
    count: number;
}
export interface Facet {
    name: string;
    buckets: Bucket[];
}

interface FilterPanelProps {
    facets: Facet[];
    onChange: (filter: Record<string, string | null>) => void;
    filterDefs: FilterDef[];
    // (The callback uses null or empty string to remove a filter, or a value to set it.)
}   

interface FilterDef {
    filterName: string;
    filterField: string;
}

export default function FilterPanel({ facets, onChange, filterDefs }: FilterPanelProps) {
    const handleCheckbox = (
        facetName: string,
        bucketValue: string,
        checked: boolean
    ) => {
        // If checked = true, set filter. If false, remove filter
        onChange({
            [facetName]: checked ? bucketValue : null,
        });
    };

    return (
        <div className="space-y-6">
            {facets.map((facet) => (
                <div key={filterDefs.find(def => def.filterField === facet.name)?.filterName || facet.name}>
                    <h3 className="font-semibold mb-2">{filterDefs.find(def => def.filterField === facet.name)?.filterName || facet.name}</h3>
                    <div className="flex flex-col space-y-2">
                        {facet.buckets.map((bucket) => (
                            <label key={bucket.value} className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    onChange={(e) =>
                                        handleCheckbox(facet.name, bucket.value, e.target.checked)
                                    }
                                />
                                <span>
                                    {bucket.value} ({bucket.count})
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}