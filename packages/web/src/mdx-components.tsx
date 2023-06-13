import Image from 'next/image';
import type { MDXComponents } from 'mdx/types';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => <h1 className="text-3xl font-light my-4 mt-8 ">{children}</h1>,
    h2: ({ children }) => <h1 className="text-xl font-bold my-2 mt-4">{children}</h1>,
    ul: ({ children }) => <ul className="list-disc list-inside">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside">{children}</ol>,
    li: ({ children }) => <li className="my-4">{children}</li>,
    p: ({ children }) => <p className="inline mb-4">{children}</p>,
    pre: ({ children }) => (
      <pre className="bg-gray-800 text-white p-4 rounded my-4">{children}</pre>
    ),
    a: ({ children, href }) => (
      <a className="text-blue-500" target="_blank" href={href}>
        {children}
      </a>
    ),
    // eslint-disable-next-line @next/next/no-img-element
    img: ({ src, alt }) => (src ? <img className="my-4" src={src} alt={alt ?? ''} /> : null),
    ...components,
  };
}
