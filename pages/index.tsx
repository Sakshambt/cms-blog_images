import Head from 'next/head';
import { FeaturedPosts } from '../sections/index';
import { PostCard, Categories, PostWidget } from '../components';
import { getPosts } from '../services';
import { Key, ReactNode } from 'react';

export async function getStaticProps() {
  const posts = (await getPosts()) || [];
  return {
    props: { posts }
  }
}

interface Props{
  posts?: [];
}

export default function Home({posts}:Props) {
  return (
    <div className="container mx-auto px-10 mb-8">
      <Head>
        <title>IMAGES</title>
        <link rel='icon' href=';/favicon.ico'/>
      </Head>
      <FeaturedPosts />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 col-span-1" >
          {posts!.map((post: { title: Key | null | undefined; node: any; }) => (
            <PostCard key={post.title} post={post.node} />
          ))}
        </div>
        <div className="lg:col-span-4 col-span-1">
          <div className="lg:sticky relative top-8">
            <PostWidget categories={undefined} slug={undefined} />
            <Categories />
          </div>
        </div>
      </div>
    </div>
  );
}

// Fetch data at build time
