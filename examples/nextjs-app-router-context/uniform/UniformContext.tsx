import { ManifestClient } from "@uniformdev/context/api";
import { ClientUniformContext } from "./ClientUniformContext";
import { cookies } from "next/headers";
import { UNIFORM_DEFAULT_COOKIE_NAME } from "@uniformdev/context";

export async function retrieveManifest() {
  const manifestClient = new ManifestClient({
    apiKey: process.env.UNIFORM_API_KEY,
    projectId: process.env.UNIFORM_PROJECT_ID,
    fetch: (req, init) => {
      return fetch(req, {
        ...init,
        cache: "force-cache",
        next: {
          tags: ["uniform-manifest"],
        },
      });
    },
  });

  const manifest = await manifestClient.get();

  return manifest;
}

export const UniformContext = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const manifest = await retrieveManifest();
  const serverCookieValue = (await cookies()).get(
    UNIFORM_DEFAULT_COOKIE_NAME
  )?.value;

  return (
    <ClientUniformContext
      manifest={manifest}
      serverCookieValue={serverCookieValue}
    >
      {children}
    </ClientUniformContext>
  );
};
