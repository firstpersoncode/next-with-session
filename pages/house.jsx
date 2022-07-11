import { withSessionSsr, SessionContextProvider } from "../session";
import House from "../components/house";
import sessionConfigs from "../utils/sessionConfigs";

export default function PageHouse({ session }) {
  return (
    <SessionContextProvider session={session} configs={sessionConfigs()}>
      <House />
    </SessionContextProvider>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps() {
    return {
      props: {},
    };
  },
  sessionConfigs()
);
