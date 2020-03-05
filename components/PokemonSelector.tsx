import { useCallback } from 'react';
import styled from 'styled-components';
import { useTypedSelector } from '../store/store';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Theme } from '../utils/theme';

export const PokemonSelector: React.FC<{ mobile?: boolean }> = ({ mobile }) => {
  const mobileMode = useTypedSelector(store => store.mobileMode);
  const allies = useTypedSelector(state => state.allies);
  const router = useRouter();

  const handleAllySelection = useCallback((id: number) => {
    router.push('/pokemon/:id', `/pokemon/${id}`, { shallow: true });
  }, [router]);

  const handleNavigateHome = useCallback(() => {
    window.location.href = '/';
  }, []);

  return (
    <Container isActiveMobileMode={mobileMode === 'allies'} mobile={mobile}>
      <AllySelector onClick={handleNavigateHome}>
        <FontAwesomeIcon icon={faHome} size="2x" />
      </AllySelector>

      {allies.map(ally => (
        <AllySelector key={ally.id} onClick={() => handleAllySelection(ally.id)}>
          <AllyImage backgroundImage={ally.icon} />
          <AllyName>{ally.name}</AllyName>
        </AllySelector>
      ))}
    </Container>
  );
};

const AllySelector = styled.button`
  width: 3rem;
  height: 3rem;
  background-color: transparent;
  border: none;
  appearance: none;
  font-family: inherit;
  -webkit-appearance: none;
  border-radius: 0.25rem;
  padding: 0;
  
  &:not(:last-child) {
    margin-right: 0.5rem;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }
`;

const AllyImage = styled.div<{ backgroundImage?: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${({ backgroundImage }) => backgroundImage});
  background-size: cover;
`;

const AllyName = styled.span`
  display: none;
  font-size: 1.125rem;
  margin-top: -0.25rem;
`;

const Container = styled.div`
  display: ${({ mobile }) => mobile ? 'none' : 'flex'};
  flex-direction: row;
  margin: -1rem 2rem 0;
  padding: 0.25rem 0.5rem;
  background-color: rgba(255, 255, 255, 0.75);

  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 0 0 0.25rem 0.25rem;

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    position: relative;
    display: ${({ isActiveMobileMode, mobile }) => isActiveMobileMode && mobile ? 'flex' : 'none'};
    width: 100%;
    background-color: transparent;
    border: none;
    flex-direction: column;
    margin: 0;
    padding: 0 0.5rem;

    & ${AllySelector} {
      display: flex;
      width: 100%;
      height: 2.5rem;
      flex-direction: row;
      background-color: #fff;
      border-radius: 1.25rem;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 1rem;
      box-shadow: ${Theme.dropShadow};

      & > svg {
        margin: 0 auto;
      }
    }

    & ${AllyImage} {
      width: 3rem;
      height: 3rem;
      margin: -0.25rem 0 0 0.5rem;
    }

    & ${AllyName} {
      display: block;
    }
  }
`;
