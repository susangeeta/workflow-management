import { useEffect } from "react";

interface DocumentMetaOptions {
  title: string;
  description: string;
  canonicalUrl?: string;
  additionalMeta?: Record<string, string>;
}

const useDocumentMeta = ({
  title,
  description,
  additionalMeta = {},
  canonicalUrl = typeof window !== "undefined" ? window.location.href : ""
}: DocumentMetaOptions): void => {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const originalTitle = document.title;
    document.title = title;

    const metaDescription = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    let createdDescription = false;
    let originalDescription: string | null = null;

    if (metaDescription) {
      originalDescription = metaDescription.getAttribute("content");
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
      createdDescription = true;
    }

    let canonicalLink = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    let createdCanonical = false;
    let originalCanonical: string | null = null;

    if (!canonicalLink && canonicalUrl) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
      createdCanonical = true;
    }

    if (canonicalLink && canonicalUrl) {
      originalCanonical = canonicalLink.getAttribute("href");
      canonicalLink.setAttribute("href", canonicalUrl);
    }

    interface AddedMetaTag {
      tag: HTMLMetaElement;
      created: boolean;
      originalContent: string | null;
    }

    const addedMetaTags: AddedMetaTag[] = [];

    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.entries(additionalMeta).forEach(([name, content]) => {
      let metaTag = document.querySelector(
        `meta[name="${name}"]`
      ) as HTMLMetaElement | null;
      let wasCreated = false;

      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.name = name;
        document.head.appendChild(metaTag);
        wasCreated = true;
      }

      const originalContent = metaTag.getAttribute("content");
      metaTag.setAttribute("content", content);

      addedMetaTags.push({
        tag: metaTag,
        created: wasCreated,
        originalContent
      });
    });

    return () => {
      document.title = originalTitle;

      if (createdDescription) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          document.head.removeChild(metaDesc);
        }
      } else if (originalDescription && metaDescription) {
        metaDescription.setAttribute("content", originalDescription);
      }

      if (createdCanonical && canonicalLink) {
        document.head.removeChild(canonicalLink);
      } else if (originalCanonical && canonicalLink) {
        canonicalLink.setAttribute("href", originalCanonical);
      }

      // biome-ignore lint/complexity/noForEach: <explanation>
      addedMetaTags.forEach(({ tag, created, originalContent }) => {
        if (created) {
          document.head.removeChild(tag);
        } else if (originalContent) {
          tag.setAttribute("content", originalContent);
        }
      });
    };
  }, [title, description, canonicalUrl, additionalMeta]);
};

export default useDocumentMeta;
