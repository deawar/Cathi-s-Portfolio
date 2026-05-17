export const heroArtworksQuery = `
  *[_type == "artwork" && heroSlide == true] | order(order asc) {
    _id, title, slug, medium, image, artworkType
  }
`;

export const featuredArtworksQuery = `
  *[_type == "artwork" && featured == true] | order(order asc)[0...8] {
    _id, title, slug, medium, dimensions, year, series, image, artworkType, available
  }
`;

export const paintingsQuery = `
  *[_type == "artwork" && artworkType == "painting"] | order(order asc, year desc) {
    _id, title, slug, medium, dimensions, year, series, image, available, price
  }
`;

export const sculpturesQuery = `
  *[_type == "artwork" && artworkType == "sculpture"] | order(order asc, year desc) {
    _id, title, slug, medium, dimensions, year, series, image, available, price
  }
`;

export const artworkBySlugQuery = `
  *[_type == "artwork" && slug.current == $slug][0] {
    _id, title, slug, medium, dimensions, year, series, image,
    description, artworkType, available, price, featured
  }
`;

export const blogPostsQuery = `
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id, title, slug, publishedAt, excerpt, featuredImage
  }
`;

export const latestBlogPostsQuery = `
  *[_type == "blogPost"] | order(publishedAt desc)[0...3] {
    _id, title, slug, publishedAt, excerpt, featuredImage
  }
`;

export const blogPostBySlugQuery = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id, title, slug, publishedAt, excerpt, featuredImage, body
  }
`;

export const paintingSeriesQuery = `
  array::unique(*[_type == "artwork" && artworkType == "painting" && defined(series)].series)
`;

export const sculptureSeriesQuery = `
  array::unique(*[_type == "artwork" && artworkType == "sculpture" && defined(series)].series)
`;
