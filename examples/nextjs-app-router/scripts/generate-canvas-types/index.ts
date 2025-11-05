import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import * as yaml from "js-yaml";
import { join } from "path";

// ============================================================================
// Constants
// ============================================================================

const MAX_COMMENT_LENGTH = 100;
const INDENT = "  ";

// ============================================================================
// Type Definitions
// ============================================================================

interface ComponentParameter {
  id: string;
  name: string;
  type: string;
  typeConfig?: {
    required?: boolean;
    options?: Array<{ text: string; value: string }>;
    min?: string | number;
    max?: number;
    isMulti?: boolean;
    allowedTypes?: string[];
    allowedContentTypes?: string[];
    childrenParams?: string[];
    [key: string]: unknown;
  };
  helpText?: string;
  guidance?: string;
}

interface ComponentSlot {
  id: string;
  name: string;
  minComponents?: number;
  maxComponents?: number;
  allowedComponents?: string[];
  allowAllComponents?: boolean;
}

interface ComponentDefinition {
  id: string;
  name: string;
  parameters?: ComponentParameter[];
  slots?: ComponentSlot[];
  icon?: string;
  categoryId?: string;
}

interface ContentTypeField {
  id: string;
  name: string;
  type: string;
  typeConfig?: {
    required?: boolean;
    isMulti?: boolean;
    allowedContentTypes?: string[];
    allowedTypes?: string[];
    max?: number;
    min?: number;
    [key: string]: unknown;
  };
  helpText?: string;
  guidance?: string;
  notLocalizedByDefault?: boolean;
}

interface ContentTypeDefinition {
  id: string;
  name: string;
  fields?: ContentTypeField[];
  icon?: string;
  type?: string;
  entryName?: string;
  thumbnailField?: string;
}

interface GenerationStats {
  componentsCount: number;
  entriesCount: number;
  blocksCount: number;
  errors: string[];
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Reads and parses a YAML file
 * @param filePath - Path to the YAML file
 * @returns Parsed YAML content or null if parsing fails
 */
function readYAMLFile<T = unknown>(filePath: string): T | null {
  try {
    const content = readFileSync(filePath, "utf-8");
    return yaml.load(content) as T;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(`⚠️  Failed to parse ${filePath}: ${errorMessage}`);
    return null;
  }
}

/**
 * Converts a string to PascalCase
 * @param str - String to convert
 * @returns PascalCase string
 */
function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]/)
    .filter(Boolean) // Remove empty strings
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Escapes special characters in comments for TypeScript
 * @param comment - Comment text to escape
 * @returns Escaped comment text
 */
function escapeComment(comment: string): string {
  return comment
    .replace(/\*\//g, "*\\/") // Escape closing comment
    .replace(/\n/g, " ") // Replace newlines with spaces
    .trim();
}

/**
 * Formats a JSDoc comment
 * @param comment - Comment text
 * @returns Formatted JSDoc comment with proper truncation
 */
function formatComment(comment: string): string {
  const escaped = escapeComment(comment);
  const truncated = escaped.substring(0, MAX_COMMENT_LENGTH);
  const suffix = escaped.length > MAX_COMMENT_LENGTH ? "..." : "";
  return `/** ${truncated}${suffix} */`;
}

/**
 * Generates type references for contentReference fields
 * @param typeConfig - Type configuration
 * @param namespace - Current namespace (Components, Entries, Blocks)
 * @param suffix - Suffix to add to type names (Parameters or ParametersFlat)
 * @returns Type reference string
 */
function generateContentReferenceType(
  typeConfig: ComponentParameter["typeConfig"] | ContentTypeField["typeConfig"],
  namespace: string,
  suffix: string
): string {
  if (
    typeConfig?.allowedContentTypes &&
    typeConfig.allowedContentTypes.length > 0
  ) {
    const entryNamespace = namespace === "Blocks" ? "Blocks" : "Entries";
    const types = typeConfig.allowedContentTypes
      .map((type) => `${entryNamespace}.${toPascalCase(type)}${suffix}`)
      .join(" | ");
    return types;
  }
  return "unknown";
}

// ============================================================================
// Type Mapping Functions
// ============================================================================

/**
 * Maps Uniform field types to TypeScript types (non-flattened version)
 * @param paramType - Uniform field type
 * @param typeConfig - Type configuration
 * @param namespace - Current namespace for context
 * @returns TypeScript type string
 */
function mapTypeToTS(
  paramType: string,
  typeConfig?: ComponentParameter["typeConfig"] | ContentTypeField["typeConfig"]
): string {
  switch (paramType) {
    case "text":
      return "string";
    case "number":
      return "number";
    case "select":
      if (
        typeConfig?.options &&
        Array.isArray(typeConfig.options) &&
        typeConfig.options.length > 0
      ) {
        return typeConfig.options.map((opt) => `'${opt.value}'`).join(" | ");
      }
      return "string";
    case "checkbox":
    case "toggle":
      return "boolean";
    case "link":
      return "Uniform.LinkParamValue";
    case "asset":
      return "Uniform.AssetParamValue";
    case "image":
      return "string";
    case "richText":
      return "Uniform.ParameterRichTextValue";
    case "datetime":
    case "date":
      return "string";
    case "contentReference":
      return typeConfig?.isMulti ? "Uniform.Entry[]" : "Uniform.Entry";
    case "$block":
      return "Uniform.BlockValue";
    case "json":
      return "unknown";
    case "group":
      return ""; // Groups are organizational only
    default:
      console.warn(`⚠️  Unknown type: ${paramType}, defaulting to 'unknown'`);
      return "unknown";
  }
}

/**
 * Maps Uniform field types to TypeScript types (flattened version)
 * @param paramType - Uniform field type
 * @param typeConfig - Type configuration
 * @param namespace - Current namespace for context
 * @returns TypeScript type string
 */
function mapTypeToTSFlat(
  paramType: string,
  typeConfig?:
    | ComponentParameter["typeConfig"]
    | ContentTypeField["typeConfig"],
  namespace: string = "Components"
): string {
  switch (paramType) {
    case "text":
      return "string";
    case "number":
      return "number";
    case "select":
      if (
        typeConfig?.options &&
        Array.isArray(typeConfig.options) &&
        typeConfig.options.length > 0
      ) {
        return typeConfig.options.map((opt) => `'${opt.value}'`).join(" | ");
      }
      return "string";
    case "checkbox":
    case "toggle":
      return "boolean";
    case "link":
      return "Uniform.LinkParamValue";
    case "asset":
      // asset gets flattened to Asset[]
      return "Uniform.Asset[]";
    case "image":
      return "string";
    case "richText":
      return "Uniform.ParameterRichTextValue";
    case "datetime":
    case "date":
      return "string";
    case "contentReference":
      // contentReference gets flattened with system params
      if (
        typeConfig?.allowedContentTypes &&
        typeConfig.allowedContentTypes.length > 0
      ) {
        const types = generateContentReferenceType(
          typeConfig,
          namespace,
          "ParametersFlat"
        );
        const wrappedType = `Uniform.WithUniformContentEntrySystemParams<${types}>`;
        return typeConfig.isMulti ? `${wrappedType}[]` : wrappedType;
      }
      return typeConfig?.isMulti
        ? "Uniform.WithUniformContentEntrySystemParams<unknown>[]"
        : "Uniform.WithUniformContentEntrySystemParams<unknown>";
    case "$block":
      // $block always references Blocks namespace with ParametersFlat suffix
      if (typeConfig?.allowedTypes && typeConfig.allowedTypes.length > 0) {
        const types = typeConfig.allowedTypes
          .map((type) => `Blocks.${toPascalCase(type)}ParametersFlat`)
          .join(" | ");
        return `Uniform.WithBlockSystemParams<${types}>[]`;
      }
      return "Uniform.WithBlockSystemParams<unknown>[]";
    case "json":
      return "unknown";
    case "group":
      return ""; // Groups are organizational only
    default:
      console.warn(`⚠️  Unknown type: ${paramType}, defaulting to 'unknown'`);
      return "unknown";
  }
}

// ============================================================================
// Parameter Generation Functions
// ============================================================================

/**
 * Generates parameters for a type definition
 * @param params - Array of parameters or fields
 * @param namespace - Current namespace
 * @param isFlat - Whether to generate flat version
 * @returns Generated parameter strings
 */
function generateParameters(
  params: Array<ComponentParameter | ContentTypeField>,
  namespace: string,
  isFlat: boolean
): string {
  if (params.length === 0) {
    return `${INDENT}  // No ${isFlat ? "fields" : "parameters"} defined\n`;
  }

  let output = "";
  for (const param of params) {
    const tsType = isFlat
      ? mapTypeToTSFlat(param.type, param.typeConfig, namespace)
      : mapTypeToTS(param.type, param.typeConfig);

    if (!tsType) continue; // Skip group types

    const isRequired = param.typeConfig?.required === true;
    const optional = isRequired ? "" : "?";

    if (param.helpText || param.guidance) {
      const comment = param.helpText || param.guidance?.split("\n")[0] || "";
      output += `${INDENT}  ${formatComment(comment)}\n`;
    }

    output += `${INDENT}  ${param.id}${optional}: ${tsType};\n`;
  }

  return output;
}

/**
 * Generates a type definition with both Parameters and ParametersFlat versions
 * @param name - Type name
 * @param interfaceName - PascalCase interface name
 * @param params - Array of parameters or fields
 * @param namespace - Current namespace
 * @param slots - Optional slots for components
 * @returns Generated type definition string
 */
function generateTypeDefinition(
  name: string,
  interfaceName: string,
  params: Array<ComponentParameter | ContentTypeField>,
  namespace: string,
  slots?: ComponentSlot[]
): string {
  let output = "";

  // Filter out group parameters
  const actualParams = params.filter((p) => p.type !== "group");

  // 1. Generate Parameters type (wrapped with ToComponentParameters)
  output += `\n${INDENT}/**\n${INDENT} * ${name} - Parameters\n${INDENT} */\n`;
  output += `${INDENT}type ${interfaceName}Parameters = Uniform.ToComponentParameters<{\n`;
  output += generateParameters(actualParams, namespace, false);
  output += `${INDENT}}>;\n`;

  // 2. Generate ParametersFlat interface (after flattenParameters transformation)
  output += `\n${INDENT}/**\n${INDENT} * ${name} - Parameters Flat\n${INDENT} */\n`;
  output += `${INDENT}interface ${interfaceName}ParametersFlat {\n`;
  output += generateParameters(actualParams, namespace, true);
  output += `${INDENT}}\n`;

  // 3. Generate Slots type if slots exist (only for components)
  if (slots && slots.length > 0) {
    output += `\n${INDENT}/**\n${INDENT} * ${name} - Slots\n${INDENT} */\n`;
    const slotNames = slots.map((slot) => `'${slot.id}'`).join(" | ");
    output += `${INDENT}type ${interfaceName}Slots = ${slotNames};\n`;
  }

  return output;
}

// ============================================================================
// Uniform Base Types Generation
// ============================================================================

/**
 * Generates the Uniform.d.ts file with base types from Uniform packages
 * @returns Generated TypeScript code
 */
function generateUniformBaseTypes(): string {
  let output = `// Auto-generated global types from Uniform packages\n`;
  output += `// Do not edit this file manually\n`;
  output += `// Generated: ${new Date().toISOString()}\n\n`;
  output += `declare namespace Uniform {\n`;

  // Core types from @uniformdev/canvas
  output += `${INDENT}// Core types from @uniformdev/canvas\n`;
  output += `${INDENT}type LinkParamValue = import('@uniformdev/canvas').LinkParamValue;\n`;
  output += `${INDENT}type AssetParamValue = import('@uniformdev/canvas').AssetParamValue;\n`;
  output += `${INDENT}type Entry = import('@uniformdev/canvas').Entry;\n`;
  output += `${INDENT}type BlockValue<T = unknown> = import('@uniformdev/canvas').BlockValue<T>;\n`;
  output += `\n`;

  // Rich text from @uniformdev/richtext
  output += `${INDENT}// Rich text from @uniformdev/richtext\n`;
  output += `${INDENT}type ParameterRichTextValue = import('@uniformdev/richtext').ParameterRichTextValue;\n`;
  output += `\n`;

  // React types from @uniformdev/canvas-react
  output += `${INDENT}// React types from @uniformdev/canvas-react\n`;
  output += `${INDENT}type ComponentInstance = import('@uniformdev/canvas-react').ComponentInstance;\n`;
  output += `\n`;

  // Component Parameter wrapper type
  output += `${INDENT}// Component Parameter wrapper type\n`;
  output += `${INDENT}type ComponentParameter<T> = import('@uniformdev/canvas-next-rsc-v2/component').ComponentParameter<T>;\n`;
  output += `\n`;

  // Transform all properties to ComponentParameter wrapped format
  output += `${INDENT}// Transform all properties to ComponentParameter wrapped format\n`;
  output += `${INDENT}type ToComponentParameters<T> = {\n`;
  output += `${INDENT}  [K in keyof T]: ComponentParameter<T[K]>;\n`;
  output += `${INDENT}};\n`;
  output += `\n`;

  // Component props type
  output += `${INDENT}// Component props type\n`;
  output += `${INDENT}type ComponentProps<T, S extends string = string> = import('@uniformdev/canvas-next-rsc-v2/component').ComponentProps<T, S>;\n`;
  output += `\n`;

  // Flattened Asset type
  output += `${INDENT}// Flattened Asset type (after flattenParameters transformation)\n`;
  output += `${INDENT}interface Asset {\n`;
  output += `${INDENT}  url: string;\n`;
  output += `${INDENT}  title: string;\n`;
  output += `${INDENT}  width: number;\n`;
  output += `${INDENT}  height: number;\n`;
  output += `${INDENT}  mediaType: string;\n`;
  output += `${INDENT}  id: string;\n`;
  output += `${INDENT}  size: number;\n`;
  output += `${INDENT}}\n`;
  output += `\n`;

  // Block system parameters
  output += `${INDENT}// Block system parameters\n`;
  output += `${INDENT}type BlockSystemParams = {\n`;
  output += `${INDENT}  type: string;\n`;
  output += `${INDENT}  id: string;\n`;
  output += `${INDENT}};\n`;
  output += `\n`;

  // Wrap type with block system parameters
  output += `${INDENT}// Wrap type with block system parameters\n`;
  output += `${INDENT}type WithBlockSystemParams<T> = T & BlockSystemParams;\n`;
  output += `\n`;

  // Entry system parameters
  output += `${INDENT}// Entry system parameters\n`;
  output += `${INDENT}type UniformContentEntrySystemParams = {\n`;
  output += `${INDENT}  id: string;\n`;
  output += `${INDENT}  slug?: string;\n`;
  output += `${INDENT}  contentType: string;\n`;
  output += `${INDENT}};\n`;
  output += `\n`;

  // Wrap type with entry system parameters
  output += `${INDENT}// Wrap type with entry system parameters\n`;
  output += `${INDENT}type WithUniformContentEntrySystemParams<T> = T & UniformContentEntrySystemParams;\n`;

  output += `}\n`;

  return output;
}

// ============================================================================
// Main Generation Functions
// ============================================================================

/**
 * Generates TypeScript type definitions for components
 * @param dataDir - Path to the data directory
 * @returns Generated TypeScript code
 */
function generateComponentTypes(dataDir: string): string {
  const componentDir = join(dataDir, "component");

  if (!existsSync(componentDir)) {
    console.warn("⚠️  Component directory not found");
    return `// No components found\ndeclare namespace Components {}\n`;
  }

  const files = readdirSync(componentDir).filter(
    (f) => f.endsWith(".yaml") || f.endsWith(".yml")
  );

  let output = `// Auto-generated from Uniform component definitions\n`;
  output += `// Do not edit this file manually\n`;
  output += `// Generated: ${new Date().toISOString()}\n\n`;
  output += `declare namespace Components {\n`;

  const components: ComponentDefinition[] = [];

  for (const file of files) {
    const filePath = join(componentDir, file);
    const data = readYAMLFile<ComponentDefinition>(filePath);

    if (data?.id) {
      components.push(data);
    }
  }

  // Sort alphabetically by id for consistent output
  components.sort((a, b) => a.id.localeCompare(b.id));

  // Generate type definitions
  for (const component of components) {
    const interfaceName = toPascalCase(component.id);
    const params = component.parameters || [];

    output += generateTypeDefinition(
      component.name,
      interfaceName,
      params,
      "Components",
      component.slots
    );
  }

  // Generate union type of all component IDs
  if (components.length > 0) {
    output += `\n${INDENT}// Component Type Union\n`;
    output += `${INDENT}type ComponentType = \n`;
    components.forEach((comp, idx) => {
      output += `${INDENT}  | '${comp.id}'${
        idx < components.length - 1 ? "\n" : ";\n"
      }`;
    });
  }

  output += `}\n`;

  return output;
}

/**
 * Generates TypeScript type definitions for content entries
 * @param dataDir - Path to the data directory
 * @returns Generated TypeScript code
 */
function generateEntryTypes(dataDir: string): string {
  const contentTypeDir = join(dataDir, "contentType");

  if (!existsSync(contentTypeDir)) {
    console.warn("⚠️  ContentType directory not found");
    return `// No content types found\ndeclare namespace Entries {}\n`;
  }

  const files = readdirSync(contentTypeDir).filter(
    (f) => f.endsWith(".yaml") || f.endsWith(".yml")
  );

  let output = `// Auto-generated from Uniform content type definitions\n`;
  output += `// Do not edit this file manually\n`;
  output += `// Generated: ${new Date().toISOString()}\n\n`;
  output += `declare namespace Entries {\n`;

  const contentTypes: ContentTypeDefinition[] = [];

  for (const file of files) {
    const filePath = join(contentTypeDir, file);
    const data = readYAMLFile<ContentTypeDefinition>(filePath);

    // Only include contentTypes, not blocks
    if (data?.id && data.type !== "block") {
      contentTypes.push(data);
    }
  }

  // Sort alphabetically by id for consistent output
  contentTypes.sort((a, b) => a.id.localeCompare(b.id));

  // Generate type definitions
  for (const contentType of contentTypes) {
    const interfaceName = toPascalCase(contentType.id);
    const fields = contentType.fields || [];

    output += generateTypeDefinition(
      contentType.name,
      interfaceName,
      fields,
      "Entries"
    );
  }

  // Generate union type of all content type IDs
  if (contentTypes.length > 0) {
    output += `\n${INDENT}// Entry Type Union\n`;
    output += `${INDENT}type EntryType = \n`;
    contentTypes.forEach((ct, idx) => {
      output += `${INDENT}  | '${ct.id}'${
        idx < contentTypes.length - 1 ? "\n" : ";\n"
      }`;
    });
  }

  output += `}\n`;

  return output;
}

/**
 * Generates TypeScript type definitions for blocks
 * @param dataDir - Path to the data directory
 * @returns Generated TypeScript code
 */
function generateBlockTypes(dataDir: string): string {
  const contentTypeDir = join(dataDir, "contentType");

  if (!existsSync(contentTypeDir)) {
    console.warn("⚠️  ContentType directory not found");
    return `// No content types found\ndeclare namespace Blocks {}\n`;
  }

  const files = readdirSync(contentTypeDir).filter(
    (f) => f.endsWith(".yaml") || f.endsWith(".yml")
  );

  let output = `// Auto-generated from Uniform content type definitions\n`;
  output += `// Do not edit this file manually\n`;
  output += `// Generated: ${new Date().toISOString()}\n\n`;
  output += `declare namespace Blocks {\n`;

  const contentTypes: ContentTypeDefinition[] = [];

  for (const file of files) {
    const filePath = join(contentTypeDir, file);
    const data = readYAMLFile<ContentTypeDefinition>(filePath);

    // Only include blocks, not contentTypes
    if (data?.id && data.type === "block") {
      contentTypes.push(data);
    }
  }

  // Sort alphabetically by id for consistent output
  contentTypes.sort((a, b) => a.id.localeCompare(b.id));

  // Generate type definitions
  for (const contentType of contentTypes) {
    const interfaceName = toPascalCase(contentType.id);
    const fields = contentType.fields || [];

    output += generateTypeDefinition(
      contentType.name,
      interfaceName,
      fields,
      "Blocks"
    );
  }

  // Generate union type of all block type IDs
  if (contentTypes.length > 0) {
    output += `\n${INDENT}// Block Type Union\n`;
    output += `${INDENT}type BlockType = \n`;
    contentTypes.forEach((ct, idx) => {
      output += `${INDENT}  | '${ct.id}'${
        idx < contentTypes.length - 1 ? "\n" : ";\n"
      }`;
    });
  }

  output += `}\n`;

  return output;
}

// ============================================================================
// Main Execution
// ============================================================================

/**
 * Main function to generate all type definitions
 */
function main(): void {
  const dataDir = join(process.cwd(), "uniform-data");
  const typesDir = join(process.cwd(), "types", "auto-generated");

  // Validate data directory exists
  if (!existsSync(dataDir)) {
    console.error(`❌ Error: Data directory not found at ${dataDir}`);
    console.error(
      "   Please run `pnpm run uniform:pull` first to fetch Uniform data."
    );
    process.exit(1);
  }

  // Ensure types directory exists
  if (!existsSync(typesDir)) {
    console.log(`📁 Creating types directory at ${typesDir}...`);
    mkdirSync(typesDir, { recursive: true });
  }

  console.log("🚀 Generating TypeScript definitions from Uniform data...\n");

  const stats: GenerationStats = {
    componentsCount: 0,
    entriesCount: 0,
    blocksCount: 0,
    errors: [],
  };

  try {
    // Generate Uniform.d.ts (base types)
    console.log("📝 Generating Uniform.d.ts...");
    const uniformTypes = generateUniformBaseTypes();
    writeFileSync(join(typesDir, "Uniform.d.ts"), uniformTypes, "utf-8");
    console.log("✅ Uniform.d.ts generated (base types)");

    // Generate Components.d.ts
    console.log("📝 Generating Components.d.ts...");
    const componentsTypes = generateComponentTypes(dataDir);
    writeFileSync(join(typesDir, "Components.d.ts"), componentsTypes, "utf-8");
    stats.componentsCount = (
      componentsTypes.match(/type \w+Parameters =/g) || []
    ).length;
    console.log(
      `✅ Components.d.ts generated (${stats.componentsCount} components)`
    );

    // Generate Entries.d.ts
    console.log("📝 Generating Entries.d.ts...");
    const entriesTypes = generateEntryTypes(dataDir);
    writeFileSync(join(typesDir, "Entries.d.ts"), entriesTypes, "utf-8");
    stats.entriesCount = (
      entriesTypes.match(/type \w+Parameters =/g) || []
    ).length;
    console.log(`✅ Entries.d.ts generated (${stats.entriesCount} entries)`);

    // Generate Blocks.d.ts
    console.log("📝 Generating Blocks.d.ts...");
    const blocksTypes = generateBlockTypes(dataDir);
    writeFileSync(join(typesDir, "Blocks.d.ts"), blocksTypes, "utf-8");
    stats.blocksCount = (
      blocksTypes.match(/type \w+Parameters =/g) || []
    ).length;
    console.log(`✅ Blocks.d.ts generated (${stats.blocksCount} blocks)`);

    // Print summary
    console.log("\n🎉 All type definitions generated successfully!");
    console.log(`\n📊 Summary:`);
    console.log(`   • Components: ${stats.componentsCount}`);
    console.log(`   • Entries: ${stats.entriesCount}`);
    console.log(`   • Blocks: ${stats.blocksCount}`);
    console.log(
      `   • Total: ${
        stats.componentsCount + stats.entriesCount + stats.blocksCount
      }`
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ Error generating types: ${errorMessage}`);
    if (error instanceof Error && error.stack) {
      console.error(`\n${error.stack}`);
    }
    process.exit(1);
  }
}

// Run main function
main();
