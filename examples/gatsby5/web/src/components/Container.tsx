import * as React from "react";
import { Layout } from "./Layout";

const Container = (props: any) => {
  return (
    <Layout>
      <div className="container mx-auto">{props.children}</div>
    </Layout>
  );
};

export default Container;
