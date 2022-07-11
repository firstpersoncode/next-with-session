import { withSessionSsr, SessionContextProvider } from "../session";
import Main from "../components/main";
import sessionConfigs from "../utils/sessionConfigs";

export default function PageIndex({ session }) {
  return (
    <SessionContextProvider session={session} configs={sessionConfigs()}>
      <Main />
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
