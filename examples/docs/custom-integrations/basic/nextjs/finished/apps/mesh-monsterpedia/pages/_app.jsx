import React from "react";
import "../styles/globals.css";
import {
  useInitializeUniformMeshSdk,
  UniformMeshSdkContextProvider,
} from "@uniformdev/mesh-sdk-react";

function MyApp({ Component, pageProps }) {
  const { initializing, error } = useInitializeUniformMeshSdk();

  if (error) {
    throw error;
  }

  return initializing ? null : (
    <UniformMeshSdkContextProvider>
      <Component {...pageProps} />
    </UniformMeshSdkContextProvider>
  );
}

export default MyApp;