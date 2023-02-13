import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";

const HomePage = ({ meetups }) => {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta name="description" content="Test Page" />
      </Head>
      <MeetupList meetups={meetups} />
    </>
  );
  w;
};

export const getStaticProps = async () => {
  const client = await MongoClient.connect(process.env.NEXT_PUBLIC_MONGODB_URL);
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map(({ _id, title, address, image }) => ({
        id: _id.toString(),
        title,
        address,
        image,
      })),
    },
    revalidate: 1,
  };
};

export default HomePage;
