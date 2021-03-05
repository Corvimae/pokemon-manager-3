import { useCallback } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippy.js/react';
import { Theme } from '../utils/theme';
import { calculateLevel } from '../utils/level';
import { useTypedSelector } from '../store/rootReducer';
import { PokemonIcon } from './Layout';

export const PokemonSelector: React.FC<{ mobile?: boolean }> = ({ mobile }) => {
  const mobileMode = useTypedSelector(store => store.pokemon.mobileMode);
  const allies = useTypedSelector(state => state.pokemon.allies);

  return (
    <Container isActiveMobileMode={mobileMode === 'allies'} mobile={mobile}>
      <AllySelector href="/">
        <FontAwesomeIcon icon={faHome} size="lg" />
      </AllySelector>

      {allies.map(ally => (
        <AllySelector key={ally.id} href={`/pokemon/${ally.id}`}>
          <Tippy content={`${ally.name} - Lv. ${calculateLevel(ally.experience)} ${ally.species}`} boundary="viewport">
            <AllyImage dexNumber={ally.species?.dexNumber ?? 0} />
          </Tippy>
          <AllyName>{ally.name}</AllyName>
          <AllyDescription>
            Lv. {calculateLevel(ally.experience)} {ally.species}
          </AllyDescription>
        </AllySelector>
      ))}
    </Container>
  );
};

const AllySelector = styled.a`
  position: relative;
  display: flex;
  width: 3rem;
  min-width: 3rem;
  height: 3rem;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  font-family: inherit;
  border-radius: 0.25rem;
  padding: 0;
  text-decoration: none;
  color: #333;
  
  &:not(:last-child) {
    margin-right: 0.5rem;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }
`;

const AllyImage = styled(PokemonIcon)`
  width: 100%;
  height: 100%;
  background-image: url(${({ backgroundImage }) => backgroundImage});
  background-size: cover;
`;

const AllyName = styled.span`
  display: none;
  font-size: 1.125rem;
  margin-top: -0.25rem;
  flex-grow: 1;
  align-self: stretch;
  align-items: center;
  line-height: normal;
`;

const AllyDescription = styled.span`
  display: none;
  min-width: max-content;
  font-size: 0.875rem;
  overflow: visible;
  align-items: center;
  line-height: normal;
  padding: 0 1rem;
`;

const Container = styled.div`
  display: ${({ mobile }) => mobile ? 'none' : 'flex'};
  min-width: min-content;
  max-width: max-content;
  flex-direction: row;
  margin: -1rem 2rem 0;
  padding: 0.25rem 0.5rem;
  background-color: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 0 0 0.25rem 0.25rem;
  overflow-x: auto;

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

    & ${AllyName},
    & ${AllyDescription} {
      display: flex;
    }
  }
`;
