export function updateSEO({
  title,
  description,
  ogTitle,
  ogDescription,
  ogUrl,
  ogImage
}) {
  if (title) {
    document.title = title;
  }
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && description) {
    metaDescription.setAttribute("content", description);
  }

  const ogTitleEl = document.querySelector('meta[property="og:title"]');
  if (ogTitleEl) {
    ogTitleEl.setAttribute("content", ogTitle || title || "");
  }

  const ogDescEl = document.querySelector('meta[property="og:description"]');
  if (ogDescEl) {
    ogDescEl.setAttribute("content", ogDescription || description || "");
  }

  const ogUrlEl = document.querySelector('meta[property="og:url"]');
  if (ogUrlEl && ogUrl) {
    ogUrlEl.setAttribute("content", ogUrl);
  }

  const ogImageEl = document.querySelector('meta[property="og:image"]');
  if (ogImageEl && ogImage) {
    ogImageEl.setAttribute("content", ogImage);
  }

  // Twitter cards
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute("content", ogTitle || title || "");
  }

  const twitterDesc = document.querySelector(
    'meta[name="twitter:description"]'
  );
  if (twitterDesc) {
    twitterDesc.setAttribute("content", ogDescription || description || "");
  }

  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (twitterImage && ogImage) {
    twitterImage.setAttribute("content", ogImage);
  }
}

export function resetSEO() {
  updateSEO({
    title: "peviitor | motor de căutare locuri de muncă",
    description: "peviitor | motor de cautare locuri de munca",
    ogTitle: "peviitor.ro - motor de cautare locuri de munca",
    ogDescription: "peviitor | motor de cautare locuri de munca",
    ogUrl: "https://peviitor.ro/",
    ogImage: "https://peviitor.ro/peviitor.jpg"
  });
}
