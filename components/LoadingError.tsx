import Link from 'next/link';
import styled from 'styled-components';
import { Theme } from '../utils/theme';

export const LoadingError: React.FC = ({ children }) => (
  <Container>
    <BallTop/>
    <BallCenter>
      <BallButton/>
      <BallButtonLower/>
      <ErrorMessage>{children}</ErrorMessage>
    </BallCenter>
    <BallBottom />
    <Link href="/">
      <ReturnButton>Return to Trainer List</ReturnButton>
    </Link>
  </Container>
);

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const BallTop = styled.div`
  width: 16rem;
  height: 8rem;
  border-radius: 8rem 8rem 0 0;
  background: #ccc;
  background-size: 200% 200%;
`;


const BallButton = styled.div`
  position: absolute;
  top: calc(50% - 1.5rem);
  left: 50%;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #f0f0f0;
  transform: translate(-50%, -50%);
`;


const BallButtonLower = styled(BallButton)`
  top: calc(50% + 1.5rem);
`;

const BallCenter = styled.div`
  position: relative;
  width: 100%;
  height: 3rem;
  border-radius: 50%;
  background-color: #f0f0f0;

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    background-color: #841383;
  }
`;

const BallBottom = styled.div`
  width: 16rem;
  height: 8rem;
  border-radius: 0 0 8rem 8rem;
  background-color: #ccc;
  background-size: 200% 200%;
`;

const ErrorMessage = styled.div`
  position: absolute; 
  display: flex;
  top: 50%;
  left: 50%;
  align-items: center;
  justify-content: center;
  width: calc(100vw - 20rem);
  height: 100%;
  z-index: 1;
  font-weight: 700;
  color: #333;
  font-size: 1.25rem;
  transform: translate(-50%, -50%);
`;

const ReturnButton = styled.a`
  position: relative;
  display: flex;
  left: 50%;
  top: 2rem;
  height: 2.5rem;
  text-decoration: none;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  margin: 0;
  padding: 0.5rem 2rem;
  background-color: #fff;
  box-shadow: ${Theme.dropShadow};
  border-radius: 2rem;
  transform: translateX(-50%);
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
    color: ${Theme.backgroundStripe};
  }
`;