import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetupDetails = ({ meetupData }) => {
  const { image, title, address, description } = meetupData;

  return (
    <MeetupDetail
      image={image}
      title={title}
      address={address}
      description={description}
    />
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(process.env.NEXT_PUBLIC_MONGODB_URL);
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  const paths = meetups.map(({ _id }) => ({
    params: { meetupId: _id.toString() },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(process.env.NEXT_PUBLIC_MONGODB_URL);
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();

  const { _id, ...otherMeetup } = meetup;

  return {
    props: {
      meetupData: {
        id: _id.toString(),
        ...otherMeetup,
      },
    },
  };
}

export default MeetupDetails;
