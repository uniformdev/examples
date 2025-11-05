import * as fs from 'fs';
import * as path from 'path';
import type { API, Collection, FileInfo, JSCodeshift, ImportDeclaration, ObjectPattern } from 'jscodeshift';
import type { ResolvedConfig } from '../types/config';
import { shouldIgnoreFile as shouldIgnoreFileWithConfig } from './config-loader';

// Component type mapping cache
let componentTypeMapping: Record<string, string> | null = null;

// Global configuration instance
let globalConfig: ResolvedConfig | null = null;

export interface ComponentInfo {
  typeName: string;
  hasParameters: boolean;
  hasSlots: boolean;
  hasParametersFlat: boolean;
  parameterNames: string[];
}

/**
 * Initialize configuration for ast-helpers
 * Must be called before using component type mapping functions
 */
export function initializeConfig(config: ResolvedConfig): void {
  globalConfig = config;
  // Clear cache when config changes
  componentTypeMapping = null;
}

/**
 * Get the current configuration
 * Auto-loads config if not initialized
 */
function getConfig(): ResolvedConfig {
  if (!globalConfig) {
    // Auto-load config when needed (for jscodeshift transforms)
    try {
      const { loadAndResolveConfig, getProjectRoot } = require('../utils/config-loader');
      const projectRoot = getProjectRoot();
      globalConfig = loadAndResolveConfig(projectRoot);
    } catch (error) {
      throw new Error(
        `Failed to load configuration: ${(error as Error).message}\n` +
          'Make sure codemod.config.ts exists in your project root. Run "npm run init" to create it.'
      );
    }
  }
  if (!globalConfig) {
    throw new Error('Failed to load configuration');
  }
  return globalConfig;
}

export function getResolvedConfig(): ResolvedConfig {
  return getConfig();
}

/**
 * Find import declaration by package name
 */
export function findImportDeclaration(
  root: Collection<any>,
  j: JSCodeshift,
  packageName: string
): Collection<ImportDeclaration> {
  return root.find(j.ImportDeclaration, {
    source: { value: packageName },
  });
}

/**
 * Add import if it doesn't exist
 */
export function addImportIfMissing(
  root: Collection<any>,
  j: JSCodeshift,
  importPath: string,
  importName: string,
  isDefault: boolean = false
): void {
  const existing = findImportDeclaration(root, j, importPath);

  if (existing.length === 0) {
    const newImport = isDefault
      ? j.importDeclaration([j.importDefaultSpecifier(j.identifier(importName))], j.stringLiteral(importPath))
      : j.importDeclaration([j.importSpecifier(j.identifier(importName))], j.stringLiteral(importPath));

    // Find the first import or the top of the file
    const firstImport = root.find(j.ImportDeclaration).at(0);
    if (firstImport.length > 0) {
      firstImport.insertBefore(newImport);
    } else {
      root.find(j.Program).get('body', 0).insertBefore(newImport);
    }
  }
}

/**
 * Remove import declaration
 */
export function removeImport(root: Collection<any>, j: JSCodeshift, packageName: string): void {
  findImportDeclaration(root, j, packageName).remove();
}

/**
 * Check if file should be ignored in transformations
 */
export function shouldIgnoreFile(filePath: string): boolean {
  const config = getConfig();
  return shouldIgnoreFileWithConfig(filePath, config);
}

/**
 * Convert camelCase to PascalCase
 */
export function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Parse component mappings file to build type mapping
 * Returns a map of component names to their type identifiers
 */
export function buildComponentTypeMapping(): Record<string, string> {
  const config = getConfig();

  // Priority 1: Use direct components object from config
  if (config.mappings.components && Object.keys(config.mappings.components).length > 0) {
    return config.mappings.components;
  }

  // Priority 2: Parse mappings file
  const mappingsPath = config.mappings.filePath;

  if (!mappingsPath || !fs.existsSync(mappingsPath)) {
    console.warn('Warning: Component mappings not found. Checked:', mappingsPath || 'no path provided');
    return {};
  }

  const mappingsContent = fs.readFileSync(mappingsPath, 'utf-8');
  const mapping: Record<string, string> = {};

  // Match export statements like: export { pageMapping } from "../components/page";
  const exportRegex = /export\s+\{\s*(\w+)\s*\}\s+from\s+['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;

  while ((match = exportRegex.exec(mappingsContent)) !== null) {
    const [, mappingName, importPath] = match;

    // Convert relative import path to absolute file path
    // e.g., "../components/page" -> "components/page.tsx"
    const mappingsDir = path.dirname(mappingsPath);
    const absoluteImportPath = path.resolve(mappingsDir, importPath);

    // Try common extensions
    const possiblePaths = [
      absoluteImportPath + '.tsx',
      absoluteImportPath + '.ts',
      path.join(absoluteImportPath, 'index.tsx'),
      path.join(absoluteImportPath, 'index.ts'),
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        try {
          const componentFileContent = fs.readFileSync(filePath, 'utf-8');

          // Match the mapping export: export const pageMapping: ... = { type: "page", component: PageComponent };
          // We need to extract both the type and component name
          const mappingRegex = new RegExp(
            `export\\s+const\\s+${mappingName}[^=]*=\\s*\\{[^}]*type:\\s*['"]([^'"]+)['"][^}]*component:\\s*(\\w+)[^}]*\\}`,
            's'
          );
          const mappingMatch = componentFileContent.match(mappingRegex);

          if (mappingMatch) {
            const [, typeId, componentName] = mappingMatch;
            // Map component name to type identifier
            // e.g., PageComponent -> "page", HeroComponent -> "hero"
            mapping[componentName] = typeId;
          }

          break; // Found the file, no need to try other paths
        } catch (error) {
          console.warn(`Warning: Could not parse mapping file ${filePath}:`, (error as Error).message);
        }
      }
    }
  }

  return mapping;
}

/**
 * Check if a component is a Canvas component (registered in resolver)
 */
export function isCanvasComponent(componentName: string): boolean {
  if (!componentTypeMapping) {
    componentTypeMapping = buildComponentTypeMapping();
  }

  return componentName in componentTypeMapping;
}

/**
 * Get PascalCase type name for a component
 */
export function getComponentTypeName(filePath: string | undefined, componentName: string): string | null {
  if (!componentTypeMapping) {
    componentTypeMapping = buildComponentTypeMapping();
  }

  // Try to find the component in the mapping
  // e.g., componentTypeMapping["PageComponent"] = "page" -> return "Page"
  if (componentTypeMapping[componentName]) {
    return toPascalCase(componentTypeMapping[componentName]);
  }

  return null;
}

/**
 * Check if a component has auto-generated types
 */
export function hasGeneratedType(typeName: string): boolean {
  const config = getConfig();
  const componentsTypesPath = config.types.filePath;

  if (!componentsTypesPath || !fs.existsSync(componentsTypesPath)) {
    return false;
  }

  const content = fs.readFileSync(componentsTypesPath, 'utf-8');

  // Check if both Parameters and ParametersFlat exist in Components namespace
  const hasParameters = content.includes(`type ${typeName}Parameters`);
  const hasParametersFlat = content.includes(`interface ${typeName}ParametersFlat`);

  return hasParameters && hasParametersFlat;
}

/**
 * Check if component has slots in auto-generated types
 */
export function hasSlots(typeName: string): boolean {
  const config = getConfig();
  const componentsTypesPath = config.types.filePath;

  if (!componentsTypesPath || !fs.existsSync(componentsTypesPath)) {
    return false;
  }

  const content = fs.readFileSync(componentsTypesPath, 'utf-8');

  // Check if Slots type exists in Components namespace
  // e.g., type PageSlots = 'content' | 'header' | 'footer';
  const slotTypeRegex = new RegExp(`type ${typeName}Slots\\s*=`);
  return slotTypeRegex.test(content);
}

/**
 * Get parameter names from auto-generated ParametersFlat interface
 */
export function getParameterNamesFromType(typeName: string): string[] {
  const config = getConfig();
  const componentsTypesPath = config.types.filePath;

  if (!componentsTypesPath || !fs.existsSync(componentsTypesPath)) {
    return [];
  }

  const content = fs.readFileSync(componentsTypesPath, 'utf-8');

  // Find the ParametersFlat interface in Components namespace
  // e.g., interface HeroParametersFlat { ... }
  const interfaceRegex = new RegExp(`interface ${typeName}ParametersFlat\\s*\\{([^}]+)\\}`, 's');
  const match = interfaceRegex.exec(content);

  if (!match) {
    return [];
  }

  const interfaceBody = match[1];

  // Extract parameter names from the interface body
  // Match patterns like: title: string; or description?: Uniform.ParameterRichTextValue;
  const paramRegex = /^\s*(\w+)(\?)?:/gm;
  const params: string[] = [];
  let paramMatch: RegExpExecArray | null;

  while ((paramMatch = paramRegex.exec(interfaceBody)) !== null) {
    params.push(paramMatch[1]);
  }

  return params;
}

/**
 * Get complete component type information
 */
export function getComponentInfo(componentName: string, filePath?: string): ComponentInfo | null {
  const typeName = getComponentTypeName(filePath, componentName);
  if (!typeName) return null;

  return {
    typeName,
    hasParameters: hasGeneratedType(typeName),
    hasSlots: hasSlots(typeName),
    hasParametersFlat: hasGeneratedType(typeName), // Same check as hasParameters
    parameterNames: getParameterNamesFromType(typeName),
  };
}

/**
 * Extract parameter names from object pattern destructuring
 */
export function extractParameterNames(pattern: ObjectPattern | undefined): string[] {
  if (!pattern || !pattern.properties) return [];

  return pattern.properties
    .filter((prop: any) => prop.type === 'Property' || prop.type === 'ObjectProperty')
    .map((prop: any) => {
      if (prop.key && prop.key.name) {
        return prop.key.name;
      }
      return null;
    })
    .filter(Boolean) as string[];
}

/**
 * Check if a component uses Type.ComponentProps or Canvas.ComponentProps
 */
export function hasComponentPropsType(path: any, j: JSCodeshift): boolean {
  const node = path.node;

  // Check if there's a type annotation
  if (!node.id || !node.id.typeAnnotation) return false;

  const typeAnnotation = node.id.typeAnnotation.typeAnnotation;

  // Check for TSTypeReference with qualified name
  if (typeAnnotation.type === 'TSTypeReference') {
    const typeName = typeAnnotation.typeName;

    // Check for Type.ComponentProps or Canvas.ComponentProps
    if (typeName.type === 'TSQualifiedName') {
      const left = typeName.left.name;
      const right = typeName.right.name;

      return (left === 'Type' || left === 'Canvas') && right === 'ComponentProps';
    }
  }

  return false;
}

/**
 * Get component name from file path or variable declaration
 */
export function getComponentNameFromPath(filePath: string, j: JSCodeshift, root: Collection<any>): string {
  // Try to find the main export
  const defaultExport = root.find(j.ExportDefaultDeclaration);

  if (defaultExport.length > 0) {
    const declaration = defaultExport.at(0).get().value.declaration;

    if (declaration.type === 'Identifier') {
      return declaration.name;
    }

    if (declaration.type === 'FunctionDeclaration' && declaration.id) {
      return declaration.id.name;
    }
  }

  // Try to find named component exports (e.g., export const HeroComponent)
  const namedExports = root.find(j.ExportNamedDeclaration);
  for (let i = 0; i < namedExports.length; i++) {
    const exportDecl = namedExports.at(i).get().value;
    const declaration = exportDecl.declaration;

    if (declaration && declaration.type === 'VariableDeclaration') {
      for (const declarator of declaration.declarations) {
        if (declarator.id && declarator.id.type === 'Identifier') {
          const name = declarator.id.name;
          // Check if it looks like a component name (ends with Component or starts with capital letter)
          if (name.endsWith('Component') || /^[A-Z]/.test(name)) {
            return name;
          }
        }
      }
    }

    if (declaration && declaration.type === 'FunctionDeclaration' && declaration.id) {
      const name = declaration.id.name;
      if (name.endsWith('Component') || /^[A-Z]/.test(name)) {
        return name;
      }
    }
  }

  // Fallback to filename
  const filename = path.basename(filePath, path.extname(filePath));
  return filename;
}
