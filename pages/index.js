import { withSessionGetServerSideProps } from "../session/lib";
import styles from "../styles/Home.module.css";

export default function Home({ session }) {
  return (
    <div className={styles.container}>
      <pre>{JSON.stringify(session, null, 4)}</pre>
    </div>
  );
}

export const getServerSideProps = withSessionGetServerSideProps(
  async function getServerSideProps(context) {
    return {
      props: { session: context.req.session.parseSession() },
    };
  },
  {
    name: "_st",
    maxAge: 60 * 30,
  }
);
