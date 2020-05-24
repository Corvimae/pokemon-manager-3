import { useTypedSelector } from "../store/store";
import styled from 'styled-components';
import { useCallback } from "react";

export const AuthStatus: React.FC = () => {
  const isLoggedIn = useTypedSelector(state => state.isLoggedIn);

  const handleClick = useCallback(() => {
    window.document.location.assign('https://pokemon.maybreak.com/');
  }, []);

  return isLoggedIn ? null : (
    <NotLoggedInWarning onClick={handleClick}>
      You are not logged into Pokemon Manager and cannot make changes. Click here to log in.
    </NotLoggedInWarning>
  );
}

const NotLoggedInWarning = styled.div`
  position: fixed;
  right: 1rem;
  top: 1rem;
  padding: 0.5rem;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 0.25rem;
  z-index: 100;
  cursor: pointer;

  &:hover {
    background-color: #000;
  }
`;


