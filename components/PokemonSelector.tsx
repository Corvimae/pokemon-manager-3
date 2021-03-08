import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { Theme } from '../utils/theme';
import { calculateLevel } from '../utils/level';
import { useTypedSelector } from '../store/rootReducer';
import { HealthBar, PokemonIcon } from './Layout';
import { Pokemon } from '../server/models/pokemon';
import Link from 'next/link';

export const PokemonSelector: React.FC<{ mobile?: boolean }> = ({ mobile }) => {
  const router = useRouter();
  const [visible, setVisible] = useState(false); 
  const mobileMode = useTypedSelector(store => store.pokemon.mobileMode);
  const allies = useTypedSelector(state => state.pokemon.allies);

  const toggleVisibility = useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  const navigateToAlly = useCallback((event: React.MouseEvent<HTMLButtonElement>, pokemon: Pokemon) => {
    event.stopPropagation();
    router.push('/pokemon/:id', `/pokemon/${pokemon.id}`);
  }, []);

  useEffect(() => {
    const handleClick = event => {
      setVisible(false);
    };

    document.body.addEventListener('click', handleClick);

    return () => {
      document.body.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <Container
      isActiveMobileMode={mobileMode === 'allies'}
      mobile={mobile}
      visible={visible}
      onClick={toggleVisibility}
    >
      <PullTab onClick={toggleVisibility}/>
      <AllyList>
        <Link href="/">
          <HomeSelector>
            <FontAwesomeIcon icon={faHome} size="lg" />
          </HomeSelector>
        </Link>

        {allies.map(ally => (
          <AllySelector key={ally.id} onClick={event => navigateToAlly(event, ally)}>
            <AllyImage species={ally.species} />
            <AllyDetails>
              <AllyName>{ally.name}</AllyName>
              <HealthBar pokemon={ally} backgroundColor="#aaa"/>
              <AllyDescription>
                Lv. {calculateLevel(ally.experience)}
              </AllyDescription>
            </AllyDetails>
          </AllySelector>
        ))}
      </AllyList>
    </Container>
  );
};

const AllySelector = styled.button`
  position: relative;
  display: flex;
  flex-direction: row;
  min-width: 10rem;
  width: max-content;
  height: 3rem;
  margin: 0.5rem 0;
  border-radius: 1.5rem;
  justify-content: center;
  align-items: center;
  border: none;
  font-family: inherit;
  padding: 0;
  text-decoration: none;
  background-color: #fff;
  font-size: 0.825rem;
  box-shadow: ${Theme.dropShadow};
  cursor: pointer;
  
  &:not(:last-child) {
    margin-right: 0.5rem;
  }

  &:hover {
    background-color: ${Theme.backgroundStripe};
    color: #fff;
  }
`;

const AllyImage = styled(PokemonIcon)`
  transform: scale(1.25);
  margin-left: 0.5rem;
`;

const AllyName = styled.span`
  white-space: nowrap;
  font-weight: 700;
  text-align: left;
`;

const AllyDetails = styled.div`
  position: relative; 
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-self: stretch;
  flex-grow: 1;
  padding: 0.25rem 1rem 0.25rem 0.25rem;
`;

const AllyDescription = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-align: right;
`;

const Container = styled.div`
  position: fixed;
  display: ${({ mobile }) => mobile ? 'none' : 'flex'};
  left: 0;
  top: ${props => props.visible ? 0 : '-4rem'};
  width: 100vw;
  height: 4rem;
  flex-direction: row;
  padding: 0 0.5rem;
  background-color: #333;
  overflow: visible;
  transition: top 250ms ease-in-out;
  cursor: pointer;
  z-index: 999;

  &:hover {
    top: ${props => !props.visible && '-3.5rem'};
  }

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

const PullTab = styled.div`
  position: absolute;
  left: 50%;
  bottom: -1rem;
  width: 4rem;
  height: 1rem;
  background-color: #333;
  border-radius: 0 0 0.25rem 0.25rem;
  transform: translateX(-50%);
`;

const AllyList = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  overflow-x: auto;
`;

const HomeSelector = styled.a`
  display: flex;
  width: 3rem;
  min-width: 3rem;
  height: 3rem;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;


  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  & svg {
    color: #999;
  }
`;