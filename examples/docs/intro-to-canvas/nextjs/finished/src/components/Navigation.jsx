import Link from "next/link";

export default function Navigation({ content }) {
  const links = content.filter((c) => c.url);
  return (
    <div>
      {links.map((e, i) => {
        const separator = i > 0 ? " :: " : null;
        return (
          <span key={e.id}>
            {separator}
            <Link href={e.url}>{e.fields.title}</Link>
          </span>
        );
      })}
    </div>
  );
}