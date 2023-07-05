import React from 'react';
import componentResolver from "@/components/componentResolver";
import {UniformSlot} from "@uniformdev/canvas-react";
import {Grid} from "@mui/material";

const CoveoContainer = () => (
    <Grid container>
        <UniformSlot name="widgets" resolveRenderer={componentResolver} />
    </Grid>
);

export default CoveoContainer;
