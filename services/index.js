import { request, gql } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

export const getPosts = async () => {
  const query = gql`
  query MyQuery {
    postsConnection(orderBy: date_DESC) {
      edges {
        node {
          author {
            id
            name
            photo {
              url
            }
          }
          createdAt
          slug
          title
          excerpts
          featuredImages {
            url
          }
          date
          categories {
            name
            slug
          }
        }
      }
    }
  }
  
  `;

  const result = await request(graphqlAPI, query);

  return result.postsConnection.edges;
};

export const getPostDetails = async (slug) => {
    const query = gql`
      query GetPostDetails($slug : String!) {
        post(where: {slug: $slug}) {
          title
          excerpts
          featuredImages {
            url
          }
          date
          createdAt
          slug
          content {
            raw
          }
          categories {
            name
            slug
          }
        }
      }
    `;
  
    const result = await request(graphqlAPI, query, { slug });
  
    return result.post;
  };
  

export const getRecentPost = async() => {
    const query = gql`
    query GetPostDetails() {
        posts(
            orderBy: date_DESC
            last: 3
        ){
            title
            featuredImages{
                url
            }
            date
            createdAt
            slug
        }
    }`;
    const result = await request(graphqlAPI, query);
    return result.posts;
}

export const getSimilarPosts = async (categories, slug) => {
    const query = gql`
      query GetPostDetails($slug: String!, $categories: [String!]) {
        posts(
          where: {slug_not: $slug, AND: {categories_some: {slug_in: $categories}}}
          last: 3
        ){
            title
            featuredImages {
              url
            }
            date
            createdAt
            slug
        }

        }
    `;
    const result = await request(graphqlAPI, query, { categories, slug });

    return result.posts;
  };

  export const getAdjacentPosts = async (createdAt, slug) => {
    const query = gql`
      query GetAdjacentPosts($createdAt: DateTime!,$slug:String!) {
        next:posts(
          first: 1
          orderBy: date_ASC
          where: {slug_not: $slug, AND: {createdAt_gte: $createdAt}}
        ) {
          title
          featuredImages {
            url
          }
          date
          createdAt
          slug
        }
        previous:posts(
          first: 1
          orderBy: date_DESC
          where: {slug_not: $slug, AND: {createdAt_lte: $createdAt}}
        ) {
          title
          featuredImages {
            url
          }
          date
          createdAt
          slug
        }
      }
    `;
  
    const result = await request(graphqlAPI, query, { slug, createdAt });
  
    return { next: result.next[0], previous: result.previous[0] };
  };

  export const getFeaturedPosts = async () => {
    const query = gql`
      query GetCategoryPost() {
        posts(where: {featuredPost: true}, orderBy: date_DESC) {
          featuredImages {
            url
          }
          title
          slug
          createdAt
          date
        }
      }   
    `;
  
    const result = await request(graphqlAPI, query);
  
    return result.posts;
  };

  export const getCategories = async () => {
    const query = gql`
      query GetGategories {
          categories {
            name
            slug
          }
      }
    `;
  
    const result = await request(graphqlAPI, query);
  
    return result.categories;
  };

  export const getCategoryPost = async (slug) => {
    const query = gql`
      query GetCategoryPost($slug: String!) {
        postsConnection(where: {categories_some: {slug: $slug}}) {
          edges {
            cursor
            node {
              createdAt
              slug
              title
              excerpts
              featuredImages {
                url
              }
              date
              categories {
                name
                slug
              }
            }
          }
        }
      }
    `;
  
    const result = await request(graphqlAPI, query, { slug });
  
    return result.postsConnection.edges;
  };