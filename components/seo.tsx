import React from 'react';
import Head from "next/head";

interface SEOProps {
  pageTitle?: string;
  description?: string;
  keywords?: string;
  author?: string;
}


const SEO: React.FC<SEOProps> = ({ pageTitle, description, keywords, author }) => (
  <>
    <Head>
      <title> {pageTitle + ' Spak Communication Pvt Ltd'} </title>
      <meta charSet="UTF-8" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
  </>
);

export default SEO;