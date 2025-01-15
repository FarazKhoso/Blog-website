

// import { useRouter } from "next/router";
// import Head from "next/head";
// import { createClient } from "next-sanity";
// import PortableText from "react-portable-text";
// import NavBar from "../../components/NavBar";

// const Post = ({ blog, profile }) => {
//   const router = useRouter();

//   if (!blog) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <>
//       <Head>
//         <title>{blog.title}</title>
//         <meta name="description" content={blog.metaDescription || "Blog details"} />
//       </Head>
//       <NavBar profile={profile} />
//       <div className="container mx-auto py-12 flex items-center justify-center min-h-screen">
//         <div className="max-w-6xl flex flex-col lg:flex-row items-center lg:items-start gap-8">
//           {/* Blog Content */}
//           <div className="lg:w-1/2 text-center lg:text-left">
//             <h1 className="text-5xl font-bold mb-6">{blog.title}</h1>
//             {/* Blog Meta */}
//             <div className="text-gray-600 mb-6">
//               <p className="text-lg font-medium">By {profile.name || "Unknown Author"}</p>
//               <p className="text-lg">Published on {new Date(blog.createdAt).toDateString()}</p>
//             </div>
//             {/* Blog Content */}
//             <div className="text-xl leading-8">
//               <PortableText
//                 content={blog.content}
//                 projectId="mpo8w933"
//                 dataset="production"
//                 serializers={{
//                   h1: (props) => <h1 style={{ color: "purple" }} {...props} />,
//                   li: ({ children }) => <li className="list-disc ml-4">{children}</li>,
//                 }}
//               />
//             </div>
//           </div>

//           {/* Blog Image */}
//           <div className="lg:w-1/2 lg:pl-8">
//             {blog.blogimage?.asset?.url && (
//               <img
//                 src={blog.blogimage.asset.url}
//                 alt={blog.blogimage.alt || blog.title}
//                 className="w-full rounded-lg lg:rounded-r-lg"
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export const getServerSideProps = async ({ params }) => {
//   const slug = params.slug;

//   const client = createClient({
//     projectId: "mpo8w933",
//     dataset: "production",
//     apiVersion: "2023-01-01",
//     useCdn: false,
//   });

//   const query = `*[_type == "blog" && slug.current == $slug][0]{
//     title,
//     content,
//     publishedAt,
//     blogimage {
//       asset -> {url},
//       alt
//     }
//   }`;

//   const profileQuery = `*[_type == "profile"][0]`;

//   const blog = await client.fetch(query, { slug });
//   const profile = await client.fetch(profileQuery);

//   if (!blog) {
//     return { notFound: true };
//   }

//   return {
//     props: {
//       blog,
//       profile,
//     },
//   };
// };

// export default Post;












import Head from "next/head";
import { createClient } from "next-sanity";
import PortableText from "react-portable-text";
import imageUrlBuilder from "@sanity/image-url";
import NavBar from "../../components/NavBar";

const Post = ({ blog, profile }) => {
  const client = createClient({
    projectId: "mpo8w933",
    dataset: "production",
    apiVersion: "2023-01-01",
    useCdn: false,
  });
  const builder = imageUrlBuilder(client);

  return (
    <>
      <Head>
        <title>{blog.title}</title>
        <meta name="description" content={blog.metaDescription || "Blog details"} />
      </Head>
      <NavBar profile={profile} />
      <div className="container mx-auto py-12 flex items-center justify-center min-h-screen">
        <div className="max-w-6xl flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Blog Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl font-bold mb-6">{blog.title}</h1>
            {/* Blog Meta */}
            <div className="flex items-center text-gray-600 mb-6">
              {blog.author?.image && (
                <img
                  src={builder.image(blog.author.image).width(50).height(50).url()}
                  alt={blog.author.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
              )}
              <div>
              <p className="text-lg font-medium">By {blog.author?.name || "Muhammad Faraz"}</p>
                <p className="text-lg">
                  Published on{" "}
                  {blog.createdAt
                    ? new Date(blog.createdAt).toDateString()
                    : "Date not available"}
                </p>
              </div>
            </div>
            {/* Blog Content */}
            <div className="text-xl leading-8">
              <PortableText
                content={blog.content}
                projectId="mpo8w933"
                dataset="production"
                serializers={{
                  h1: (props) => <h1 style={{ color: "purple" }} {...props} />,
                  li: ({ children }) => <li className="list-disc ml-4">{children}</li>,
                }}
              />
            </div>
          </div>

          {/* Blog Image */}
          <div className="lg:w-1/2 lg:pl-8">
            {blog.blogimage?.asset?.url && (
              <img
                src={blog.blogimage.asset.url}
                alt={blog.blogimage.alt || blog.title}
                className="w-full rounded-lg lg:rounded-r-lg"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async ({ params }) => {
  const slug = params.slug;

  const client = createClient({
    projectId: "mpo8w933",
    dataset: "production",
    apiVersion: "2023-01-01",
    useCdn: false,
  });

  const query = `*[_type == "blog" && slug.current == $slug][0]{
    title,
    content,
    createdAt,
    blogimage {
      asset -> {url},
      alt
    },
    author -> {
      name,
      image
    }
  }`;

  const profileQuery = `*[_type == "profile"][0]`;

  const blog = await client.fetch(query, { slug });
  const profile = await client.fetch(profileQuery);

  if (!blog) {
    return { notFound: true };
  }

  return {
    props: {
      blog,
      profile,
    },
  };
};

export default Post;
