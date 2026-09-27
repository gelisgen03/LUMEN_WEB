import { MDXRemote } from "next-mdx-remote/rsc";
import { QuoteBlock } from "@/components/sections/quote-block";
import { cn } from "@/lib/utils";

/**
 * Components available inside MDX files, e.g.
 *   <Quote author="Nom, rôle">Texte de la citation</Quote>
 */
const components = {
  Quote: ({ children, author }: { children: string; author: string }) => (
    <QuoteBlock quote={children} author={author} className="not-prose my-10" />
  ),
  // Headings in MDX bodies start at h2: the page title is the only h1.
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 {...props} />,
};

/** Compiled at build time on the server: ships zero JS to the browser. */
export function MdxContent({ source, className }: { source: string; className?: string }) {
  return (
    <div className={cn("prose-lumen max-w-prose", className)}>
      <MDXRemote source={source} components={components} />
    </div>
  );
}
