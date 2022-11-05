import {
  enhance,
  EnhancerBuilder,
  generateHash,
  RootComponentInstance,
  IN_CONTEXT_EDITOR_QUERY_STRING_PARAM,
} from "@uniformdev/canvas";
import { NextApiHandler } from "next";
import getConfig from "next/config";

const queryParamsToPreserve = [IN_CONTEXT_EDITOR_QUERY_STRING_PARAM];

const handleGet: NextApiHandler = async (req, res) => {
  const {
    serverRuntimeConfig: { previewSecret },
  } = getConfig();

  if (!req.query.slug) {
    return res.status(200).json({ message: "Missing slug" });
  }

  // raw string of the incoming slug
  const slug = Array.isArray(req.query.slug)
    ? req.query.slug[0]
    : req.query.slug;

  if (req.query.disable) {
    res.clearPreviewData();
    res.redirect(slug);
    return;
  }

  const isUsingPreviewSecret = Boolean(previewSecret);

  if (isUsingPreviewSecret && req.query.secret !== previewSecret) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // enable preview mode and redirect to the slug to preview
  res.setPreviewData({ yay: "tacos" });

  const newQuery = new URLSearchParams();
  queryParamsToPreserve.forEach((param) => {
    const paramValue = req.query[param];
    if (typeof paramValue === "string") {
      newQuery.append(param, paramValue);
    }
  });
  const urlToRedirectTo = newQuery.toString()
    ? `${slug}?${newQuery.toString()}`
    : slug;

  res.redirect(urlToRedirectTo);
};

const handlePost: NextApiHandler = async (req, res) => {
  const body:
    | {
        composition: RootComponentInstance;
        hash: number;
      }
    | undefined = req.body;

  if (!body?.composition) {
    return res.status(400).json({ message: "Missing composition" });
  }

  const {
    serverRuntimeConfig: { previewSecret },
  } = getConfig();

  const { composition } = body;

  const hasProvidedHash = Boolean(body.hash);
  const hasConfiguredHash = Boolean(previewSecret);

  if (hasProvidedHash && hasConfiguredHash) {
    const calculatedHash = generateHash({
      composition,
      secret: previewSecret,
    });

    if (calculatedHash !== body.hash) {
      return res.status(500).json({ message: "Not authorized" });
    }
  } else if (hasConfiguredHash) {
    return res.status(500).json({ message: "Not authorized" });
  }

  await enhance({
    composition,
    enhancers: new EnhancerBuilder().parameter((e) => {
      if (typeof e.parameter.value === "string") {
        return e.parameter.value.replace(/personalization/gi, "p13n");
      }
    }),
    context: {
      preview: true,
    },
  });

  return res.status(200).json({
    composition,
  });
};

const handler: NextApiHandler = async (req, res) => {
  const method = req.method?.toLocaleLowerCase();

  if (method === "get") {
    return handleGet(req, res);
  } else if (method === "post") {
    return handlePost(req, res);
  }

  return res.status(400).json({ message: "Method not implemented" });
};

export default handler;
