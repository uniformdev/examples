import { ResolveComponentResultWithType } from "@/uniform/models";
import { getDefaultProjectMapClient } from "@uniformdev/canvas-next-rsc";

interface NodeData {
  previewValue?: string;
  [key: string]: any;
}

interface Node {
  id: string;
  name: string;
  order: number;
  path: string;
  type: string;
  pathSegment: string;
  data: NodeData;
  compositionId?: string;
}

interface TreeNode {
  name: string;
  path: string;
  children: Record<string, TreeNode>;
}

interface TreeNodeProps {
  node: TreeNode;
  level?: number;
}

const SitemapComponent: React.FC = async () => {
  const { nodes } = (await getDefaultProjectMapClient({
    searchParams: {},
  }).getNodes({})) as any;

  // Function to transform flat nodes into hierarchical structure
  const buildTree = (nodes: Node[]): Record<string, TreeNode> => {
    const tree: Record<string, TreeNode> = {};

    nodes.forEach((node) => {
      const pathParts = node.path.split("/").filter((p) => p);
      let currentLevel = tree;

      pathParts.forEach((part) => {
        if (part.startsWith(":")) {
          // Skip dynamic segments for navigation
          return;
        }

        if (!currentLevel[part]) {
          currentLevel[part] = {
            name:
              part === ""
                ? node.name
                : part.charAt(0).toUpperCase() + part.slice(1),
            children: {},
            path: node.path,
          };
        }
        currentLevel = currentLevel[part].children;
      });
    });

    return tree;
  };

  // Recursive component to render tree structure
  const TreeNode: React.FC<TreeNodeProps> = ({ node, level = 0 }) => {
    if (!node) return null;

    const hasChildren = Object.keys(node.children).length > 0;
    const marker = level === 0 ? "•" : level === 1 ? "○" : "■";

    return (
      <li className="py-1">
        <span className="inline-flex items-center">
          <span className="mr-2">{marker}</span>
          <span className="text-gray-900">{node.name}</span>
        </span>
        {hasChildren && (
          <ul className={`ml-${level < 2 ? "6" : "8"} mt-1`}>
            {Object.entries(node.children).map(([key, child]) => (
              <TreeNode key={key} node={child} level={level + 1} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  const tree = buildTree(nodes);

  return (
    <nav className="p-4" role="navigation" aria-label="Site Navigation">
      <ul className="space-y-2">
        {Object.entries(tree).map(([key, node]) => (
          <TreeNode key={key} node={node} />
        ))}
      </ul>
    </nav>
  );
};

export type SitemapProps = {};

export const sitemapMapping: ResolveComponentResultWithType = {
  type: "sitemap",
  component: SitemapComponent,
};
