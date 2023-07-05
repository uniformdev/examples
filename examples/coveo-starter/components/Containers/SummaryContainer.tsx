import React from 'react';
import componentResolver from "@/components/componentResolver";
import {UniformSlot} from "@uniformdev/canvas-react";
import {Grid} from "@mui/material";

const SummaryContainer = () => (
    <Grid container my={3} alignItems="center">
        <UniformSlot name="widgets" resolveRenderer={componentResolver} />
    </Grid>
);

export default SummaryContainer;