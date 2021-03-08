import Link from 'next/link';
import styled from 'styled-components';
import { Button } from '../../components/Layout';
import { Theme } from '../../utils/theme';

const LoginPage = () => (
  <Container>
    <LeftPanelBackground />
    <div>
      <PageTitle>Pokemon Manager 3</PageTitle>
    </div>
    <ActionContainer>
      <Link href="/auth">
        <LoginAction>
          Connect with Twitch
        </LoginAction>
      </Link>
    </ActionContainer>
  </Container>

);

export async function getServerSideProps(_ctx) {
  return {
    props: {},
  };
}

export default LoginPage;

const Container = styled.div`
  position: relative;
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: row;
`;

const LeftPanelBackground = styled.div`
  position: absolute;
  top: 0;
  left: -6rem;
  width: calc(50% + 6rem);
  height: 100%;
  background-color: ${Theme.backgroundStripe};
  clip-path: polygon(0 0, 100% 0%, calc(100% - 8rem) 100%, 0% 100%);
  z-index: -1;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    right: 4rem;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.25);
    clip-path: polygon(0 0, 100% 0%, calc(100% - 8rem) 100%, 0% 100%);
    z-index: -2;
  }
`;

const PageTitle = styled.div`
  display: flex;
  width: 36rem;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 2rem;
  font-weight: 700; 
  margin-top: 1rem;
  padding: 0.25rem 1rem;
  background-color: #333;
  margin-bottom: 1rem;
`;

const ActionContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 8rem;
  transform: translateY(-50%);
`;

const LoginAction = styled(Button)`
  padding: 1rem 8rem;
  border-radius: 2rem;
`;
