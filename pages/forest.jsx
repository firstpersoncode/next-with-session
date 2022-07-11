import { withSessionSsr, SessionContextProvider } from "../session";
import Forest from "../components/forest";
import sessionConfigs from "../utils/sessionConfigs";

export default function PageForest({ session }) {
  return (
    <SessionContextProvider session={session} configs={sessionConfigs()}>
      <Forest />
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
