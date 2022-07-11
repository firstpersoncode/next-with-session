import { withSessionSsr, SessionContextProvider } from "../session";
import Lake from "../components/lake";
import sessionConfigs from "../utils/sessionConfigs";

export default function PageLake({ session }) {
  return (
    <SessionContextProvider session={session} configs={sessionConfigs()}>
      <Lake />
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
